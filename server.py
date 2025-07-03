#!/usr/bin/env python3
"""
Simple HTTP server to serve the ECOWAS ISP dominance mapping application
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse
import mimetypes

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def guess_type(self, path):
        # Ensure proper MIME types for GeoJSON
        base, ext = os.path.splitext(path)
        if ext == '.geojson':
            return 'application/geo+json'
        return super().guess_type(path)
    
    def translate_path(self, path):
        # Handle URL encoding issues with special characters
        import urllib.parse
        path = urllib.parse.unquote(path, encoding='utf-8')
        return super().translate_path(path)
    
    def do_GET(self):
        # Override GET to handle encoding issues more robustly
        try:
            return super().do_GET()
        except (FileNotFoundError, OSError):
            # Try alternative encodings for special characters
            import urllib.parse
            original_path = self.path
            
            # Try different decoding approaches
            alt_paths = [
                urllib.parse.unquote(original_path, encoding='utf-8'),
                urllib.parse.unquote(original_path, encoding='latin-1'),
                original_path.replace('%C3%A9', 'é').replace('%c3%a9', 'é')
            ]
            
            for alt_path in alt_paths:
                try:
                    self.path = alt_path
                    return super().do_GET()
                except (FileNotFoundError, OSError):
                    continue
            
            # If all fail, restore original and let it 404
            self.path = original_path
            return super().do_GET()

def main():
    PORT = int(os.environ.get('PORT', 5000))
    HOST = '0.0.0.0'  # Always bind to 0.0.0.0 for cloud deployment
    
    try:
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            print(f"🌍 ECOWAS ISP Dominance Map Server")
            print(f"📡 Server running at http://{HOST}:{PORT}")
            print(f"📂 Serving from: {os.getcwd()}")
            print("🔗 Open in browser to view the interactive map")
            print("Press Ctrl+C to stop the server")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
