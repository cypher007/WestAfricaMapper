#!/usr/bin/env python3
"""
Test server with no cache headers to verify navigation menu
"""
import http.server
import socketserver
import os
import sys

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    port = 5001
    
    try:
        with socketserver.TCPServer(('0.0.0.0', port), NoCacheHTTPRequestHandler) as httpd:
            print(f'🌍 ECOWAS Test Server - No Cache')
            print(f'📡 Server running at http://0.0.0.0:{port}')
            print(f'📂 Serving from: {os.getcwd()}')
            print(f'🔗 Open in browser to test navigation menu')
            print('Press Ctrl+C to stop the server')
            httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n🛑 Server stopped')
        sys.exit(0)
    except Exception as e:
        print(f'❌ Error starting server: {e}')
        sys.exit(1)

if __name__ == '__main__':
    main()