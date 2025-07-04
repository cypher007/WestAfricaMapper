/**
 * ECOWAS ISP Dominance Interactive Map
 * Interactive visualization of foreign ISP dominance in West African countries
 */

// Global variables
let map;
let geojsonLayer;
let colonialBordersLayer;
let infrastructureLayer;
let coverageLayer;
let governanceData = {};
let currentMode = 'isp'; // 'isp' or 'governance'

// ISP dominance data for ECOWAS countries
const cedeaoData = {
    'Senegal': {
        operators: ['Sonatel/Orange (France) - 60%', 'Free (USA/UE) - 25%', 'Expresso (Soudan) - 15%'],
        dominance: 'France',
        color: '#4a90e2',
        dependency: '85% étranger',
        colonial: 'AOF Française (1895-1960)',
        coverage: { '4G': '85%', '3G': '95%', '5G': '15%' },
        capital: 'Dakar',
        analysis: 'Sonatel, filiale d\'Orange, contrôle le marché depuis l\'indépendance'
    },
    'Mali': {
        operators: ['Orange (France) - 70%', 'MTN (Afrique du Sud) - 25%', 'Autres - 5%'],
        dominance: 'France',
        color: '#4a90e2',
        dependency: '95% étranger',
        colonial: 'AOF Française (1890-1960)',
        coverage: { '4G': '60%', '3G': '80%', '5G': '5%' },
        capital: 'Bamako',
        analysis: 'Domination française écrasante maintenue'
    },
    'Burkina Faso': {
        operators: ['Orange (France) - 50%', 'Moov (Maroc) - 45%', 'Autres - 5%'],
        dominance: 'Mixed',
        color: '#50e3c2',
        dependency: '95% étranger',
        colonial: 'AOF Française (1896-1960)',
        coverage: { '4G': '70%', '3G': '85%', '5G': '8%' },
        capital: 'Ouagadougou',
        analysis: 'Duopole franco-marocain'
    },
    'Niger': {
        operators: ['Orange (France) - 55%', 'Airtel (Inde) - 35%', 'Moov (Maroc) - 10%'],
        dominance: 'France',
        color: '#4a90e2',
        dependency: '100% étranger',
        colonial: 'AOF Française (1896-1960)',
        coverage: { '4G': '55%', '3G': '75%', '5G': '3%' },
        capital: 'Niamey',
        analysis: 'Maintien de l\'influence française malgré la concurrence'
    },
    'Guinea': {
        operators: ['Orange (France) - 60%', 'MTN (Afrique du Sud) - 35%', 'Autres - 5%'],
        dominance: 'France',
        color: '#4a90e2',
        dependency: '95% étranger',
        colonial: 'AOF Française (1898-1958)',
        coverage: { '4G': '65%', '3G': '80%', '5G': '5%' },
        capital: 'Conakry',
        analysis: 'Orange domine malgré l\'arrivée de MTN'
    },
    'Ivory Coast': {
        operators: ['Orange (France) - 45%', 'MTN (Afrique du Sud) - 35%', 'Moov (Maroc) - 20%'],
        dominance: 'Mixed',
        color: '#50e3c2',
        dependency: '100% étranger',
        colonial: 'AOF Française (1893-1960)',
        coverage: { '4G': '90%', '3G': '95%', '5G': '25%' },
        capital: 'Yamoussoukro',
        analysis: 'Marché fragmenté entre trois puissances étrangères'
    },
    'Ghana': {
        operators: ['MTN (Afrique du Sud) - 50%', 'Vodafone (UK) - 25%', 'AirtelTigo (Inde) - 25%'],
        dominance: 'South Africa',
        color: '#7ed321',
        dependency: '100% étranger',
        colonial: 'Gold Coast Britannique (1874-1957)',
        coverage: { '4G': '95%', '3G': '98%', '5G': '30%' },
        capital: 'Accra',
        analysis: 'MTN s\'impose dans l\'ancien territoire britannique'
    },
    'Togo': {
        operators: ['Moov (Maroc) - 55%', 'Togocel (Mixed) - 45%'],
        dominance: 'Morocco',
        color: '#d0021b',
        dependency: '90% étranger',
        colonial: 'Togo Allemand puis Français (1884-1960)',
        coverage: { '4G': '75%', '3G': '90%', '5G': '10%' },
        capital: 'Lomé',
        analysis: 'Influence marocaine croissante'
    },
    'Benin': {
        operators: ['MTN (Afrique du Sud) - 60%', 'Moov (Maroc) - 35%', 'Autres - 5%'],
        dominance: 'South Africa',
        color: '#7ed321',
        dependency: '95% étranger',
        colonial: 'AOF Française (1904-1960)',
        coverage: { '4G': '80%', '3G': '90%', '5G': '15%' },
        capital: 'Porto-Novo',
        analysis: 'MTN domine l\'ancien territoire français'
    },
    'Nigeria': {
        operators: ['MTN (Afrique du Sud) - 40%', 'Airtel (Inde) - 25%', 'Glo (Nigeria) - 20%', 'Autres - 15%'],
        dominance: 'Mixed',
        color: '#50e3c2',
        dependency: '65% étranger',
        colonial: 'Nigeria Britannique (1901-1960)',
        coverage: { '4G': '88%', '3G': '95%', '5G': '20%' },
        capital: 'Abuja',
        analysis: 'Marché le plus diversifié mais encore dominé par l\'étranger'
    },
    'Liberia': {
        operators: ['Lonestar (Libéria/MTN) - 45%', 'Orange (France) - 30%', 'Cellcom (Israel) - 25%'],
        dominance: 'Mixed',
        color: '#50e3c2',
        dependency: '80% étranger',
        colonial: 'République indépendante (fondée 1847)',
        coverage: { '4G': '60%', '3G': '75%', '5G': '5%' },
        capital: 'Monrovia',
        analysis: 'Malgré l\'indépendance historique, forte dépendance étrangère'
    },
    'Sierra Leone': {
        operators: ['Africell (UK/USA) - 50%', 'Orange (France) - 30%', 'Airtel (Inde) - 20%'],
        dominance: 'UK/USA',
        color: '#9013fe',
        dependency: '100% étranger',
        colonial: 'Sierra Leone Britannique (1808-1961)',
        coverage: { '4G': '65%', '3G': '80%', '5G': '8%' },
        capital: 'Freetown',
        analysis: 'Domination anglo-saxonne via Africell'
    },
    'Guinea-Bissau': {
        operators: ['Orange (France) - 60%', 'MTN (Afrique du Sud) - 35%', 'Autres - 5%'],
        dominance: 'France',
        color: '#4a90e2',
        dependency: '95% étranger',
        colonial: 'Guinée Portugaise (1879-1974)',
        coverage: { '4G': '45%', '3G': '65%', '5G': '2%' },
        capital: 'Bissau',
        analysis: 'Influence française post-coloniale malgré l\'héritage portugais'
    },
    'Cape Verde': {
        operators: ['CVMóvel (Cape Verde/Portugal) - 60%', 'Unitel T+ (Angola) - 40%'],
        dominance: 'Mixed',
        color: '#50e3c2',
        dependency: '60% étranger',
        colonial: 'Cap-Vert Portugais (1462-1975)',
        coverage: { '4G': '90%', '3G': '95%', '5G': '20%' },
        capital: 'Praia',
        analysis: 'Influence lusophone mais dépendance modérée'
    },
    'Gambia': {
        operators: ['Africell (UK/USA) - 50%', 'Comium (Liban) - 30%', 'QCell (Qatar) - 20%'],
        dominance: 'UK/USA',
        color: '#9013fe',
        dependency: '100% étranger',
        colonial: 'Gambie Britannique (1888-1965)',
        coverage: { '4G': '70%', '3G': '85%', '5G': '10%' },
        capital: 'Banjul',
        analysis: 'Petit marché dominé par des intérêts étrangers diversifiés'
    }
};

// Colonial borders data (simplified historical boundaries)
const colonialBorders = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "AOF - Afrique Occidentale Française",
                "colonial_power": "France",
                "period": "1895-1960"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-17.5, 12.3], [-17.5, 16.7], [-11.4, 16.7], [-5.5, 15.1], 
                    [4.3, 25.0], [2.4, 15.1], [-1.5, 12.2], [-5.5, 9.4], 
                    [-17.5, 12.3]
                ]]
            }
        }
    ]
};

/**
 * Initialize the map and all its components
 */
function initializeMap() {
    try {
        // Create map instance
        map = L.map('map', {
            center: [10, -5],
            zoom: 5,
            zoomControl: true,
            attributionControl: true
        });

        // Add base tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors | ISP Data Analysis 2025',
            maxZoom: 18
        }).addTo(map);

        // Load GeoJSON data
        loadGeoJSONData();

        // Setup event listeners
        setupEventListeners();

        // Hide loading overlay
        hideLoadingOverlay();

    } catch (error) {
        console.error('Error initializing map:', error);
        showError('Erreur lors de l\'initialisation de la carte. Veuillez recharger la page.');
    }
}

/**
 * Load and process GeoJSON data for ECOWAS countries
 */
async function loadGeoJSONData() {
    try {
        console.log('Loading GeoJSON data...');
        const response = await fetch('data/cedeao_countries.geojson');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const responseText = await response.text();
        console.log('GeoJSON response received, length:', responseText.length);
        
        const geojsonData = JSON.parse(responseText);
        console.log('GeoJSON parsed successfully, features count:', geojsonData.features?.length);
        
        // Create and add GeoJSON layer
        geojsonLayer = L.geoJSON(geojsonData, {
            style: styleCountry,
            onEachFeature: onEachFeature
        });

        geojsonLayer.addTo(map);

        // Fit map to bounds
        map.fitBounds(geojsonLayer.getBounds(), {
            padding: [20, 20]
        });

        // Add colonial borders layer
        addColonialBorders();

        // Add infrastructure markers
        addInfrastructureMarkers();

        // Add coverage indicators
        addCoverageIndicators();

        // Add legend
        addLegend();

    } catch (error) {
        console.error('Error loading GeoJSON data:', error);
        console.error('Error details:', error.message);
        showError(`Erreur lors du chargement des données cartographiques: ${error.message}. Vérifiez votre connexion internet.`);
    }
}

/**
 * Get color based on ISP dominance
 */
function getColor(dominance) {
    return dominance === 'France'      ? '#0000ff' :
           dominance === 'Sud-Afrique' ? '#00ff00' :
           dominance === 'South Africa' ? '#00ff00' :
           dominance === 'Maroc'        ? '#ff0000' :
           dominance === 'Morocco'      ? '#ff0000' :
           dominance === 'Inde'         ? '#ff8000' :
           dominance === 'India'        ? '#ff8000' :
           dominance === 'UK/USA'       ? '#800080' :
           dominance === 'Mixed'        ? '#50e3c2' :
           '#999999';
}

/**
 * Style function for countries based on ISP dominance
 */
function styleCountry(feature) {
    const countryName = feature.properties.name || feature.properties.NAME || feature.properties.admin;
    
    // Map country names to match our data structure
    const nameMapping = {
        'Sierra Leone': 'Sierra Leone',
        'Guinea': 'Guinea',
        'Liberia': 'Liberia',
        'Côte d\'Ivoire': 'Ivory Coast',
        'Ghana': 'Ghana',
        'Togo': 'Togo',
        'Benin': 'Benin',
        'Nigeria': 'Nigeria',
        'Niger': 'Niger',
        'Burkina Faso': 'Burkina Faso',
        'Mali': 'Mali',
        'Senegal': 'Senegal',
        'Gambia': 'Gambia',
        'Guinea-Bissau': 'Guinea-Bissau',
        'Cape Verde': 'Cape Verde'
    };
    
    const mappedName = nameMapping[countryName] || countryName;
    let dominance = 'Mixed'; // Default fallback
    
    // Get dominance from our data
    if (cedeaoData[mappedName]) {
        dominance = cedeaoData[mappedName].dominance;
    }
    
    return {
        fillColor: getColor(dominance),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

/**
 * Add interactive features to each country
 */
function onEachFeature(feature, layer) {
    const countryName = feature.properties.name || feature.properties.NAME || feature.properties.admin;
    
    // Map country names to match our data structure
    const nameMapping = {
        'Sierra Leone': 'Sierra Leone',
        'Guinea': 'Guinea',
        'Liberia': 'Liberia',
        'Côte d\'Ivoire': 'Ivory Coast',
        'Ghana': 'Ghana',
        'Togo': 'Togo',
        'Benin': 'Benin',
        'Nigeria': 'Nigeria',
        'Niger': 'Niger',
        'Burkina Faso': 'Burkina Faso',
        'Mali': 'Mali',
        'Senegal': 'Senegal',
        'Gambia': 'Gambia',
        'Guinea-Bissau': 'Guinea-Bissau',
        'Cape Verde': 'Cape Verde'
    };
    
    const mappedName = nameMapping[countryName] || countryName;
    const countryData = cedeaoData[mappedName];

    if (!countryData) {
        layer.bindTooltip(`
            <strong>${countryName}</strong><br>
            <em>Données non disponibles</em>
        `, {
            className: 'custom-tooltip',
            permanent: false,
            direction: 'top'
        });
        return;
    }

    // Create enhanced tooltip content with ISP statistics
    const ispList = countryData.operators.map(op => `<li class="isp-item">${op}</li>`).join('');
    const coverageStats = countryData.coverage ? 
        `<div class="coverage-stats">
            <span class="coverage-4g">4G: ${countryData.coverage['4G']}</span>
            <span class="coverage-3g">3G: ${countryData.coverage['3G']}</span>
            <span class="coverage-5g">5G: ${countryData.coverage['5G']}</span>
        </div>` : '';
    
    const tooltipContent = `
        <div class="tooltip-content enhanced">
            <div class="tooltip-header">
                <strong class="country-name">${countryName}</strong>
                <span class="dominance-badge ${countryData.dominance.toLowerCase().replace(' ', '-')}">${getDominanceText(countryData.dominance)}</span>
            </div>
            <div class="tooltip-body">
                <div class="basic-info">
                    <span class="capital">📍 ${countryData.capital}</span>
                    <span class="dependency">📊 Dépendance: ${countryData.dependency}</span>
                </div>
                <div class="isp-section">
                    <strong class="section-title">📡 Opérateurs ISP:</strong>
                    <ul class="isp-list">${ispList}</ul>
                </div>
                ${coverageStats}
                <div class="colonial-info">
                    <small>🏛️ ${countryData.colonial}</small>
                </div>
            </div>
        </div>
    `;

    layer.bindTooltip(tooltipContent, {
        className: 'custom-tooltip',
        permanent: false,
        direction: 'auto',
        offset: [0, -10],
        opacity: 0.95
    });

    // Add click event for detailed modal
    layer.on('click', function(e) {
        showCountryModal(countryName, countryData);
        highlightLegendItem(countryData.dominance);
    });

    // Enhanced hover effects with ISP statistics
    layer.on('mouseover', function(e) {
        const layer = e.target;
        layer.setStyle({
            weight: 4,
            fillOpacity: 0.9,
            color: '#000',
            dashArray: '3'
        });
        highlightLegendItem(countryData.dominance);
        
        // Update sidebar statistics on hover
        updateHoverStatistics(countryData, countryName);
    });

    layer.on('mouseout', function(e) {
        geojsonLayer.resetStyle(e.target);
        removeHighlightFromLegend();
        clearHoverStatistics();
    });
}

/**
 * Get human-readable dominance text
 */
function getDominanceText(dominance) {
    const dominanceMap = {
        'France': 'Française',
        'South Africa': 'Sud-Africaine',
        'Morocco': 'Marocaine',
        'India': 'Indienne',
        'UK/USA': 'Anglo-Saxonne',
        'Mixed': 'Mixte'
    };
    return dominanceMap[dominance] || dominance;
}

/**
 * Add colonial borders layer
 */
function addColonialBorders() {
    colonialBordersLayer = L.geoJSON(colonialBorders, {
        style: {
            color: '#8B4513',
            weight: 3,
            opacity: 0.7,
            dashArray: '10,5',
            fill: false
        }
    });

    if (document.getElementById('showColonialBorders').checked) {
        colonialBordersLayer.addTo(map);
    }
}

/**
 * Add infrastructure markers
 */
function addInfrastructureMarkers() {
    const infrastructurePoints = [
        { name: 'Dakar - Hub Orange', coords: [14.6928, -17.4467], type: 'fiber' },
        { name: 'Lagos - Data Center MTN', coords: [6.5244, 3.3792], type: 'datacenter' },
        { name: 'Accra - Landing Station', coords: [5.6037, -0.1870], type: 'submarine' },
        { name: 'Abidjan - Hub Régional', coords: [5.3600, -4.0083], type: 'hub' }
    ];

    infrastructureLayer = L.layerGroup();

    infrastructurePoints.forEach(point => {
        const marker = L.circleMarker(point.coords, {
            radius: 8,
            fillColor: getInfraColor(point.type),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });

        marker.bindTooltip(`
            <strong>${point.name}</strong><br>
            Type: ${getInfraTypeText(point.type)}
        `, {
            className: 'custom-tooltip'
        });

        infrastructureLayer.addLayer(marker);
    });

    if (document.getElementById('showInfrastructure').checked) {
        infrastructureLayer.addTo(map);
    }
}

/**
 * Get infrastructure type color
 */
function getInfraColor(type) {
    const colorMap = {
        'fiber': '#ff6b6b',
        'datacenter': '#4ecdc4',
        'submarine': '#45b7d1',
        'hub': '#96ceb4'
    };
    return colorMap[type] || '#666';
}

/**
 * Get infrastructure type text
 */
function getInfraTypeText(type) {
    const typeMap = {
        'fiber': 'Fibre Optique',
        'datacenter': 'Centre de Données',
        'submarine': 'Station d\'Atterrissage',
        'hub': 'Hub Régional'
    };
    return typeMap[type] || type;
}

/**
 * Add coverage indicators
 */
function addCoverageIndicators() {
    coverageLayer = L.layerGroup();

    Object.entries(cedeaoData).forEach(([country, data]) => {
        if (data.coverage && data.coverage['4G']) {
            const coverage4G = parseInt(data.coverage['4G']);
            const coords = getCountryCenter(country);
            
            if (coords) {
                const circle = L.circle(coords, {
                    radius: coverage4G * 1000, // Radius based on coverage percentage
                    fillColor: getCoverageColor(coverage4G),
                    color: getCoverageColor(coverage4G),
                    weight: 1,
                    opacity: 0.3,
                    fillOpacity: 0.1
                });

                circle.bindTooltip(`
                    <strong>${country}</strong><br>
                    Couverture 4G: ${data.coverage['4G']}<br>
                    Couverture 3G: ${data.coverage['3G']}<br>
                    Couverture 5G: ${data.coverage['5G']}
                `, {
                    className: 'custom-tooltip'
                });

                coverageLayer.addLayer(circle);
            }
        }
    });

    if (document.getElementById('showCoverage').checked) {
        coverageLayer.addTo(map);
    }
}

/**
 * Get country center coordinates (simplified)
 */
function getCountryCenter(countryName) {
    const centers = {
        'Senegal': [14.6928, -17.4467],
        'Mali': [17.5707, -3.9962],
        'Burkina Faso': [12.2383, -1.5616],
        'Niger': [17.6078, 8.0817],
        'Guinea': [9.9456, -9.6966],
        'Ivory Coast': [7.5400, -5.5471],
        'Ghana': [7.9465, -1.0232],
        'Togo': [8.6195, 0.8248],
        'Benin': [9.3077, 2.3158],
        'Nigeria': [9.0765, 7.3986],
        'Liberia': [6.4281, -9.4295],
        'Sierra Leone': [8.4606, -11.7799],
        'Guinea-Bissau': [11.8037, -15.1804],
        'Cape Verde': [16.5388, -24.0132],
        'Gambia': [13.4432, -15.3101]
    };
    return centers[countryName];
}

/**
 * Get coverage color based on percentage
 */
function getCoverageColor(percentage) {
    if (percentage >= 90) return '#27ae60';
    if (percentage >= 70) return '#f39c12';
    if (percentage >= 50) return '#e74c3c';
    return '#95a5a6';
}

/**
 * Show country details modal
 */
function showCountryModal(countryName, countryData) {
    const modal = document.getElementById('countryModal');
    const modalBody = document.getElementById('modalBody');

    const operatorsList = countryData.operators.map(op => `<li>${op}</li>`).join('');

    modalBody.innerHTML = `
        <h2>${countryName}</h2>
        <div class="modal-section">
            <h3>📊 Répartition du Marché</h3>
            <ul class="operators-list">
                ${operatorsList}
            </ul>
        </div>
        
        <div class="modal-section">
            <h3>🌐 Couverture Réseau</h3>
            <div class="coverage-grid">
                <div class="coverage-item">
                    <span class="coverage-tech">5G</span>
                    <span class="coverage-percent">${countryData.coverage['5G']}</span>
                </div>
                <div class="coverage-item">
                    <span class="coverage-tech">4G</span>
                    <span class="coverage-percent">${countryData.coverage['4G']}</span>
                </div>
                <div class="coverage-item">
                    <span class="coverage-tech">3G</span>
                    <span class="coverage-percent">${countryData.coverage['3G']}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h3>🏛️ Contexte Historique</h3>
            <p><strong>Période coloniale:</strong> ${countryData.colonial}</p>
            <p><strong>Dépendance actuelle:</strong> ${countryData.dependency}</p>
        </div>
        
        <div class="modal-section">
            <h3>📈 Analyse</h3>
            <p>${countryData.analysis}</p>
        </div>
    `;

    // Add modal styles if not already present
    if (!document.querySelector('#modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .modal-section {
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
            }
            .modal-section:last-child {
                border-bottom: none;
            }
            .modal-section h3 {
                color: #2c3e50;
                margin-bottom: 15px;
                font-size: 1.1em;
            }
            .operators-list {
                list-style: none;
                padding: 0;
            }
            .operators-list li {
                background: #f8f9fa;
                padding: 10px 15px;
                margin-bottom: 8px;
                border-radius: 6px;
                border-left: 4px solid #667eea;
            }
            .coverage-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
            }
            .coverage-item {
                text-align: center;
                padding: 15px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border-radius: 8px;
            }
            .coverage-tech {
                display: block;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .coverage-percent {
                font-size: 1.5em;
                font-weight: bold;
            }
        `;
        document.head.appendChild(modalStyles);
    }

    modal.style.display = 'block';
}

/**
 * Highlight legend item
 */
function highlightLegendItem(dominance) {
    removeHighlightFromLegend();
    const legendItem = document.querySelector(`[data-dominance="${dominance}"]`);
    if (legendItem) {
        legendItem.classList.add('highlighted');
    }
}

/**
 * Remove highlight from legend
 */
function removeHighlightFromLegend() {
    document.querySelectorAll('.legend-item.highlighted').forEach(item => {
        item.classList.remove('highlighted');
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Control toggles
    document.getElementById('showInfrastructure').addEventListener('change', function(e) {
        if (e.target.checked) {
            infrastructureLayer.addTo(map);
        } else {
            map.removeLayer(infrastructureLayer);
        }
    });

    document.getElementById('showColonialBorders').addEventListener('change', function(e) {
        if (e.target.checked) {
            colonialBordersLayer.addTo(map);
        } else {
            map.removeLayer(colonialBordersLayer);
        }
    });

    document.getElementById('showCoverage').addEventListener('change', function(e) {
        if (e.target.checked) {
            coverageLayer.addTo(map);
        } else {
            map.removeLayer(coverageLayer);
        }
    });

    // Modal close events
    const modal = document.getElementById('countryModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        removeHighlightFromLegend();
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            removeHighlightFromLegend();
        }
    });

    // Legend item interactions
    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const dominance = this.dataset.dominance;
            highlightCountriesWithDominance(dominance);
        });

        item.addEventListener('mouseleave', function() {
            resetCountryStyles();
        });
    });
}

/**
 * Highlight countries with specific dominance
 */
function highlightCountriesWithDominance(dominance) {
    if (!geojsonLayer) return;

    geojsonLayer.eachLayer(function(layer) {
        const countryName = layer.feature.properties.name || layer.feature.properties.NAME || layer.feature.properties.admin;
        const countryData = cedeaoData[countryName];

        if (countryData && countryData.dominance === dominance) {
            layer.setStyle({
                weight: 4,
                fillOpacity: 1,
                color: '#000'
            });
        } else {
            layer.setStyle({
                weight: 2,
                fillOpacity: 0.4,
                color: 'white'
            });
        }
    });
}

/**
 * Reset country styles
 */
function resetCountryStyles() {
    if (!geojsonLayer) return;

    geojsonLayer.eachLayer(function(layer) {
        geojsonLayer.resetStyle(layer);
    });
}

/**
 * Hide loading overlay
 */
function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading');
    loadingOverlay.classList.add('hidden');
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
    }, 300);
}

/**
 * Show error message
 */
function showError(message) {
    const loadingOverlay = document.getElementById('loading');
    loadingOverlay.innerHTML = `
        <div class="error-message">
            <h3>❌ Erreur</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="retry-button">Réessayer</button>
        </div>
    `;

    // Add error styles
    if (!document.querySelector('#error-styles')) {
        const errorStyles = document.createElement('style');
        errorStyles.id = 'error-styles';
        errorStyles.textContent = `
            .error-message {
                text-align: center;
                color: #721c24;
                background: #f8d7da;
                padding: 30px;
                border-radius: 10px;
                border: 1px solid #f5c6cb;
            }
            .retry-button {
                background: #dc3545;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 15px;
                font-size: 1em;
            }
            .retry-button:hover {
                background: #c82333;
            }
        `;
        document.head.appendChild(errorStyles);
    }
}

/**
 * Update statistics based on loaded data
 */
function updateStatistics() {
    const totalCountries = Object.keys(cedeaoData).length;
    const foreignDominated = Object.values(cedeaoData).filter(country => 
        parseInt(country.dependency) > 50
    ).length;
    
    const sovereignCountries = Object.values(cedeaoData).filter(country => 
        parseInt(country.dependency) < 50
    ).length;

    const uniqueOrigins = new Set(Object.values(cedeaoData).map(country => country.dominance)).size;

    document.getElementById('stat-countries').textContent = totalCountries;
    document.getElementById('stat-foreign').textContent = Math.round((foreignDominated / totalCountries) * 100) + '%';
    document.getElementById('stat-origins').textContent = uniqueOrigins;
    document.getElementById('stat-sovereignty').textContent = sovereignCountries;
}

/**
 * Add interactive legend to the map
 */
function addLegend() {
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const origins = {
            'France': '#0000ff',
            'Sud-Afrique': '#00ff00',
            'Maroc': '#ff0000',
            'Inde': '#ff8000',
            'UK/USA': '#800080',
            'Mixed': '#50e3c2',
            'Autre': '#999999'
        };
        
        div.innerHTML = '<h4 style="margin: 0 0 10px 0; color: #2c3e50;">Domination ISP</h4>';
        
        for (const key in origins) {
            div.innerHTML +=
                '<i style="background:' + origins[key] + '; width: 18px; height: 18px; float: left; margin-right: 8px; margin-top: 2px; opacity: 0.8; border-radius: 3px; border: 1px solid #fff;"></i> ' +
                '<span style="font-size: 12px; color: #333;">' + key + '</span><br style="clear: both; margin-bottom: 5px;">';
        }
        
        // Add CSS for the legend
        div.style.cssText = `
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            border-radius: 8px;
            line-height: 24px;
            color: #333;
            font-family: 'Inter', sans-serif;
            border: 1px solid #ccc;
        `;
        
        return div;
    };
    
    legend.addTo(map);
}

/**
 * Load governance data from JSON file
 */
async function loadGovernanceData() {
    try {
        const response = await fetch('data/governance_data.json');
        governanceData = await response.json();
        console.log('Governance data loaded:', Object.keys(governanceData).length, 'countries');
        return true;
    } catch (error) {
        console.error('Error loading governance data:', error);
        return false;
    }
}

/**
 * Calculate governance score for a country
 */
function calculateGovernanceScore(countryData) {
    let score = 0;
    
    if (countryData.digital_strategy && !countryData.digital_strategy.includes('Pas de') && !countryData.digital_strategy.includes('Non disponible')) {
        score += 1;
    }
    if (countryData.data_protection_law && !countryData.data_protection_law.includes('Pas de') && !countryData.data_protection_law.includes('Non disponible')) {
        score += 1;
    }
    if (countryData.data_protection_authority && !countryData.data_protection_authority.includes('Aucune') && !countryData.data_protection_authority.includes('Non disponible')) {
        score += 1;
    }
    if (countryData.au_alignment && (countryData.au_alignment.includes('Oui') || countryData.au_alignment.includes('Partiel'))) {
        score += 1;
    }
    
    return score;
}

/**
 * Get governance level based on score
 */
function getGovernanceLevel(score) {
    if (score >= 3) return 'Avancée';
    if (score >= 2) return 'Partielle';
    return 'Limitée';
}

/**
 * Get governance color based on level
 */
function getGovernanceColor(level) {
    switch(level) {
        case 'Avancée': return '#2ecc71';
        case 'Partielle': return '#f39c12';
        case 'Limitée': return '#e74c3c';
        default: return '#95a5a6';
    }
}

/**
 * Style country for governance mode
 */
function styleCountryGovernance(feature) {
    const countryName = feature.properties.name || feature.properties.NAME || feature.properties.admin;
    const nameMapping = {
        'Sierra Leone': 'Sierra Leone',
        'Guinea': 'Guinea',
        'Liberia': 'Liberia',
        'Côte d\'Ivoire': 'Ivory Coast',
        'Ghana': 'Ghana',
        'Togo': 'Togo',
        'Benin': 'Benin',
        'Nigeria': 'Nigeria',
        'Niger': 'Niger',
        'Burkina Faso': 'Burkina Faso',
        'Mali': 'Mali',
        'Senegal': 'Senegal',
        'Gambia': 'Gambia',
        'Guinea-Bissau': 'Guinea-Bissau',
        'Cape Verde': 'Cape Verde'
    };
    
    const mappedName = nameMapping[countryName] || countryName;
    const countryData = governanceData[mappedName];
    
    let level = 'Limitée';
    if (countryData) {
        const score = calculateGovernanceScore(countryData);
        level = getGovernanceLevel(score);
    }
    
    return {
        fillColor: getGovernanceColor(level),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

/**
 * Setup mode toggle functionality
 */
function setupModeToggle() {
    const ispBtn = document.getElementById('isp-mode');
    const govBtn = document.getElementById('governance-mode');
    const infraBtn = document.getElementById('infrastructure-mode');
    const ispAnalysis = document.getElementById('isp-analysis');
    const govAnalysis = document.getElementById('governance-analysis');
    const infraAnalysis = document.getElementById('infrastructure-analysis');
    
    if (!ispBtn || !govBtn || !infraBtn) return;
    
    ispBtn.addEventListener('click', () => {
        currentMode = 'isp';
        setActiveButton(ispBtn, [govBtn, infraBtn]);
        showAnalysis(ispAnalysis, [govAnalysis, infraAnalysis]);
        
        // Refresh map styles
        if (geojsonLayer) {
            geojsonLayer.setStyle(styleCountry);
        }
    });
    
    govBtn.addEventListener('click', () => {
        currentMode = 'governance';
        setActiveButton(govBtn, [ispBtn, infraBtn]);
        showAnalysis(govAnalysis, [ispAnalysis, infraAnalysis]);
        
        // Update governance statistics
        updateGovernanceStatistics();
        
        // Refresh map styles
        if (geojsonLayer) {
            geojsonLayer.setStyle(styleCountryGovernance);
        }
    });
    
    infraBtn.addEventListener('click', () => {
        currentMode = 'infrastructure';
        setActiveButton(infraBtn, [ispBtn, govBtn]);
        showAnalysis(infraAnalysis, [ispAnalysis, govAnalysis]);
        
        // For infrastructure mode, we keep the ISP styling as base
        if (geojsonLayer) {
            geojsonLayer.setStyle(styleCountry);
        }
    });
}

/**
 * Helper function to set active button
 */
function setActiveButton(activeBtn, otherBtns) {
    activeBtn.classList.add('active');
    otherBtns.forEach(btn => btn.classList.remove('active'));
}

/**
 * Helper function to show analysis section
 */
function showAnalysis(activeSection, otherSections) {
    activeSection.style.display = 'block';
    otherSections.forEach(section => section.style.display = 'none');
}

/**
 * Update governance statistics
 */
function updateGovernanceStatistics() {
    let strategiesCount = 0;
    let protectionLawsCount = 0;
    let authoritiesCount = 0;
    let alignmentCount = 0;
    
    Object.values(governanceData).forEach(country => {
        if (country.digital_strategy && !country.digital_strategy.includes('Pas de') && !country.digital_strategy.includes('Non disponible')) {
            strategiesCount++;
        }
        if (country.data_protection_law && !country.data_protection_law.includes('Pas de') && !country.data_protection_law.includes('Non disponible')) {
            protectionLawsCount++;
        }
        if (country.data_protection_authority && !country.data_protection_authority.includes('Aucune') && !country.data_protection_authority.includes('Non disponible')) {
            authoritiesCount++;
        }
        if (country.au_alignment && (country.au_alignment.includes('Oui') || country.au_alignment.includes('Partiel'))) {
            alignmentCount++;
        }
    });
    
    const govStrategies = document.getElementById('governance-strategies');
    const govProtection = document.getElementById('governance-protection');
    const govAuthorities = document.getElementById('governance-authorities');
    const govAlignment = document.getElementById('governance-alignment');
    
    if (govStrategies) govStrategies.textContent = strategiesCount;
    if (govProtection) govProtection.textContent = protectionLawsCount;
    if (govAuthorities) govAuthorities.textContent = authoritiesCount;
    if (govAlignment) govAlignment.textContent = alignmentCount;
}

// Governance dashboard data
const regionData = {
    "Afrique du Nord": { 
        total: 8, 
        malabo: 0, 
        countries: ["Algérie", "Égypte", "Libye", "Maroc", "Soudan", "Tunisie", "Sahara Occidental", "Mauritanie"],
        details: "Aucune ratification - Focus sur cadres nationaux"
    },
    "Afrique Centrale": { 
        total: 9, 
        malabo: 4, 
        countries: ["Angola", "Cameroun", "RCA", "Tchad", "RDC", "Guinée Équatoriale", "Gabon", "São Tomé", "Congo"],
        details: "44% ratification - Leaders: Gabon, São Tomé"
    },
    "Afrique de l'Ouest": { 
        total: 15, 
        malabo: 7, 
        countries: ["Bénin", "Burkina Faso", "Cap-Vert", "Côte d'Ivoire", "Gambie", "Ghana", "Guinée", "Guinée-Bissau", "Liberia", "Mali", "Niger", "Nigeria", "Sénégal", "Sierra Leone", "Togo"],
        details: "47% ratification - Meilleure région CEDEAO"
    },
    "Afrique Australe": { 
        total: 12, 
        malabo: 3, 
        countries: ["Afrique du Sud", "Botswana", "Eswatini", "Lesotho", "Malawi", "Maurice", "Mozambique", "Namibie", "Seychelles", "Zambie", "Zimbabwe", "Madagascar"],
        details: "25% ratification - Cadres avancés mais ratification lente"
    },
    "Afrique de l'Est": { 
        total: 11, 
        malabo: 1, 
        countries: ["Burundi", "Comores", "Djibouti", "Érythrée", "Éthiopie", "Kenya", "Rwanda", "Somalie", "Soudan du Sud", "Tanzanie", "Ouganda"],
        details: "9% ratification - Focus sur développement numérique"
    }
};

const westAfricaFrameworks = {
    "Convention de Malabo": {
        value: 7,
        total: 15,
        percentage: 46.7,
        countries: ["Bénin", "Cap-Vert", "Côte d'Ivoire", "Ghana", "Guinée", "Sénégal", "Togo"],
        description: "Cadre juridique continental pour la cybersécurité"
    },
    "Stratégies Numériques": {
        value: 15,
        total: 15,
        percentage: 100,
        countries: "Tous les pays CEDEAO",
        description: "Plans nationaux de transformation numérique"
    },
    "Lois Protection Données": {
        value: 15,
        total: 15,
        percentage: 100,
        countries: "Tous les pays CEDEAO",
        description: "Législation sur la protection des données personnelles"
    },
    "Autorités Protection": {
        value: 12,
        total: 15,
        percentage: 80,
        countries: ["Bénin", "Burkina Faso", "Cap-Vert", "Côte d'Ivoire", "Gambie", "Ghana", "Guinée", "Mali", "Niger", "Nigeria", "Sénégal", "Togo"],
        description: "Organismes de régulation et de contrôle"
    }
};

const westAfricaCountries = [
    { name: "Bénin", malabo: 1, strategy: 1, dataLaw: 1, dataAuth: 1, score: 4 },
    { name: "Cap-Vert", malabo: 1, strategy: 1, dataLaw: 1, dataAuth: 1, score: 4 },
    { name: "Côte d'Ivoire", malabo: 1, strategy: 1, dataLaw: 1, dataAuth: 1, score: 4 },
    { name: "Ghana", malabo: 1, strategy: 1, dataLaw: 1, dataAuth: 1, score: 4 },
    { name: "Guinée", malabo: 1, strategy: 1, dataLaw: 1, dataAuth: 1, score: 4 },
    { name: "Burkina Faso", malabo: 0, strategy: 1, dataLaw: 1, dataAuth: 1, score: 3 },
    { name: "Mali", malabo: 0, strategy: 1, dataLaw: 1, dataAuth: 1, score: 3 },
    { name: "Niger", malabo: 0, strategy: 1, dataLaw: 1, dataAuth: 1, score: 3 },
    { name: "Sénégal", malabo: 1, strategy: 1, dataLaw: 1, dataAuth: 0, score: 3 },
    { name: "Togo", malabo: 1, strategy: 1, dataLaw: 1, dataAuth: 0, score: 3 },
    { name: "Gambie", malabo: 0, strategy: 1, dataLaw: 1, dataAuth: 1, score: 3 },
    { name: "Guinée-Bissau", malabo: 0, strategy: 1, dataLaw: 1, dataAuth: 0, score: 2 },
    { name: "Liberia", malabo: 0, strategy: 1, dataLaw: 1, dataAuth: 0, score: 2 },
    { name: "Nigeria", malabo: 0, strategy: 1, dataLaw: 1, dataAuth: 1, score: 3 },
    { name: "Sierra Leone", malabo: 0, strategy: 1, dataLaw: 1, dataAuth: 0, score: 2 }
];

/**
 * Initialize governance charts
 */
function initializeGovernanceCharts() {
    // Malabo Convention by Region Chart
    const malaboCtx = document.getElementById('malaboChart');
    if (malaboCtx) {
        const malaboChart = new Chart(malaboCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(regionData).map(region => {
                    const data = regionData[region];
                    return `${region} (${data.malabo}/${data.total})`;
                }),
                datasets: [{
                    data: Object.values(regionData).map(data => 
                        Math.round((data.malabo / data.total) * 100)
                    ),
                    backgroundColor: [
                        '#ff6b6b',
                        '#4ecdc4',
                        '#45b7d1',
                        '#96ceb4',
                        '#ffeaa7'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 3,
                    hoverBorderColor: 'white'
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            color: '#2c3e50', 
                            font: { size: 11 },
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const regionName = Object.keys(regionData)[context[0].dataIndex];
                                return regionName;
                            },
                            label: function(context) {
                                const regionName = Object.keys(regionData)[context.dataIndex];
                                const data = regionData[regionName];
                                return [
                                    `Ratification: ${data.malabo}/${data.total} pays (${context.parsed}%)`,
                                    `${data.details}`,
                                    `Pays: ${data.countries.slice(0, 3).join(', ')}${data.countries.length > 3 ? '...' : ''}`
                                ];
                            }
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: 1
                    }
                }
            }
        });
    }

    // West Africa Frameworks Chart
    const frameworksCtx = document.getElementById('frameworksChart');
    if (frameworksCtx) {
        const frameworksChart = new Chart(frameworksCtx, {
            type: 'bar',
            data: {
                labels: ['Convention\nde Malabo', 'Stratégies\nNumériques', 'Lois Protection\nDonnées', 'Autorités\nProtection'],
                datasets: [{
                    label: 'Pays conformes',
                    data: [7, 15, 15, 12],
                    backgroundColor: [
                        'rgba(255, 107, 107, 0.8)',
                        'rgba(78, 205, 196, 0.8)',
                        'rgba(69, 183, 209, 0.8)',
                        'rgba(150, 206, 180, 0.8)'
                    ],
                    borderColor: [
                        '#ff6b6b',
                        '#4ecdc4',
                        '#45b7d1',
                        '#96ceb4'
                    ],
                    borderWidth: 2,
                    hoverBackgroundColor: [
                        'rgba(255, 107, 107, 1)',
                        'rgba(78, 205, 196, 1)',
                        'rgba(69, 183, 209, 1)',
                        'rgba(150, 206, 180, 1)'
                    ],
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                const frameworkNames = Object.keys(westAfricaFrameworks);
                                return frameworkNames[context[0].dataIndex];
                            },
                            label: function(context) {
                                const frameworkNames = Object.keys(westAfricaFrameworks);
                                const frameworkKey = frameworkNames[context.dataIndex];
                                const framework = westAfricaFrameworks[frameworkKey];
                                return [
                                    `${framework.value}/${framework.total} pays (${framework.percentage}%)`,
                                    `${framework.description}`,
                                    `Exemples: ${Array.isArray(framework.countries) ? framework.countries.slice(0, 3).join(', ') : framework.countries}`
                                ];
                            }
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 15,
                        ticks: { 
                            color: '#2c3e50',
                            callback: function(value) {
                                return value + '/15';
                            }
                        },
                        grid: { color: 'rgba(44, 62, 80, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#2c3e50', font: { size: 10 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

/**
 * Generate country cards for governance dashboard
 */
function generateGovernanceCountryCards() {
    const tableBody = document.getElementById('governance-countries-table');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Use actual governance data from JSON
    Object.entries(governanceData).forEach(([country, data]) => {
        const row = document.createElement('tr');
        
        const score = calculateGovernanceScore(data);
        const status = getGovernanceLevel(score);
        
        // Helper function to create indicator badge
        function createIndicator(value, field) {
            if (field === 'malabo_convention') {
                return value === 'Oui' ? 
                    '<span class="governance-indicator indicator-yes">Oui</span>' : 
                    '<span class="governance-indicator indicator-no">Non</span>';
            } else if (field === 'digital_strategy') {
                return value && value !== 'Non disponible' ? 
                    '<span class="governance-indicator indicator-yes">Oui</span>' : 
                    '<span class="governance-indicator indicator-no">Non</span>';
            } else if (field === 'data_protection_law') {
                return value && value !== 'Non disponible' && !value.includes('Pas de') ? 
                    '<span class="governance-indicator indicator-yes">Oui</span>' : 
                    '<span class="governance-indicator indicator-no">Non</span>';
            } else if (field === 'data_protection_authority') {
                if (value && value !== 'Aucune' && !value.includes('Aucune') && !value.includes('projet')) {
                    return '<span class="governance-indicator indicator-yes">Oui</span>';
                } else {
                    return '<span class="governance-indicator indicator-no">Non</span>';
                }
            }
            return '<span class="governance-indicator indicator-no">Non</span>';
        }
        
        // Determine status styling
        let statusClass = '';
        let statusText = '';
        if (score >= 4) {
            statusClass = 'indicator-yes';
            statusText = '🟢 Cadre complet';
        } else if (score >= 3) {
            statusClass = 'indicator-partial';
            statusText = '🟡 Bon progrès';
        } else {
            statusClass = 'indicator-no';
            statusText = '🟠 En développement';
        }
        
        row.innerHTML = `
            <td class="country-name">${country}</td>
            <td>${createIndicator(data.malabo_convention, 'malabo_convention')}</td>
            <td>${createIndicator(data.digital_strategy, 'digital_strategy')}</td>
            <td>${createIndicator(data.data_protection_law, 'data_protection_law')}</td>
            <td>${createIndicator(data.data_protection_authority, 'data_protection_authority')}</td>
            <td><span class="score-badge">${score}/4 indicateurs</span></td>
            <td><span class="governance-indicator ${statusClass}">${statusText}</span></td>
        `;
        
        tableBody.appendChild(row);
    });
}

function getGovernanceCountryStatus(country) {
    if (country.score === 4) return "🟢 Cadre complet";
    if (country.score === 3) return "🟡 Bon progrès";
    if (country.score === 2) return "🟠 En développement";
    return "🔴 Cadre minimal";
}

// Cybersecurity data from authentic ITU CSV (2022)
const cyberSecurityData = {
    countries: [
        { name: "Bénin", iso: "BEN", mandate: false, legislation: true, areas: ["Data protection", "Online privacy", "Critical information infrastructure protection", "Online fraud", "Child online protection", "Online gambling & gaming", "Cybercrime", "Network security"] },
        { name: "Burkina Faso", iso: "BFA", mandate: false, legislation: true, areas: [] },
        { name: "Cap-Vert", iso: "CPV", mandate: false, legislation: true, areas: ["Online fraud", "Child online protection", "Cybercrime", "Network security", "Data protection", "Online privacy"] },
        { name: "Côte d'Ivoire", iso: "CIV", mandate: false, legislation: true, areas: [] },
        { name: "Gambie", iso: "GMB", mandate: false, legislation: true, areas: [] },
        { name: "Ghana", iso: "GHA", mandate: true, legislation: true, areas: ["Critical information infrastructure protection", "Network security"] },
        { name: "Guinée", iso: "GIN", mandate: false, legislation: true, areas: [] },
        { name: "Guinée-Bissau", iso: "GNB", mandate: false, legislation: true, areas: [] },
        { name: "Liberia", iso: "LBR", mandate: false, legislation: true, areas: [] },
        { name: "Mali", iso: "MLI", mandate: false, legislation: true, areas: [] },
        { name: "Niger", iso: "NER", mandate: false, legislation: true, areas: [] },
        { name: "Nigeria", iso: "NGA", mandate: false, legislation: true, areas: [] },
        { name: "Sénégal", iso: "SEN", mandate: false, legislation: true, areas: ["Data protection", "Critical information infrastructure protection", "Online privacy", "Network security", "Cybercrime", "Child online protection", "Online gambling & gaming", "Online fraud", "Spam"] },
        { name: "Sierra Leone", iso: "SLE", mandate: true, legislation: true, areas: ["Critical information infrastructure protection", "Data protection", "Online privacy", "Child online protection", "Network security", "Cybercrime", "Online fraud", "Spam"] },
        { name: "Togo", iso: "TGO", mandate: false, legislation: true, areas: [] }
    ]
};

/**
 * Initialize cybersecurity charts
 */
function initializeCybersecurityCharts() {
    // Cybersecurity Mandate Chart
    const cyberMandateCtx = document.getElementById('cyberMandateChart');
    if (cyberMandateCtx) {
        const mandateData = cyberSecurityData.countries.map(country => ({
            country: country.name,
            mandate: country.mandate ? 1 : 0
        }));

        const cyberMandateChart = new Chart(cyberMandateCtx, {
            type: 'bar',
            data: {
                labels: mandateData.map(d => d.country),
                datasets: [{
                    label: 'Mandat CyberSécurité',
                    data: mandateData.map(d => d.mandate),
                    backgroundColor: mandateData.map(d => d.mandate ? '#4ecdc4' : '#ff6b6b'),
                    borderColor: mandateData.map(d => d.mandate ? '#2c3e50' : '#c0392b'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                const country = cyberSecurityData.countries[context.dataIndex];
                                return [
                                    `Mandat: ${country.mandate ? 'Oui' : 'Non'}`,
                                    `Législation: ${country.legislation ? 'Oui' : 'Non'}`,
                                    `Domaines couverts: ${country.areas.length}`
                                ];
                            }
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: { 
                            color: '#2c3e50',
                            callback: function(value) {
                                return value === 1 ? 'Oui' : 'Non';
                            }
                        },
                        grid: { color: 'rgba(44, 62, 80, 0.1)' }
                    },
                    x: {
                        ticks: { 
                            color: '#2c3e50', 
                            font: { size: 9 },
                            maxRotation: 45
                        },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // Cybersecurity Areas Chart
    const cyberAreasCtx = document.getElementById('cyberAreasChart');
    if (cyberAreasCtx) {
        // Count frequency of each area across all countries
        const areasCounts = {};
        cyberSecurityData.countries.forEach(country => {
            country.areas.forEach(area => {
                areasCounts[area] = (areasCounts[area] || 0) + 1;
            });
        });

        const sortedAreas = Object.entries(areasCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8); // Top 8 areas

        const cyberAreasChart = new Chart(cyberAreasCtx, {
            type: 'doughnut',
            data: {
                labels: sortedAreas.map(([area, count]) => `${area} (${count})`),
                datasets: [{
                    data: sortedAreas.map(([area, count]) => count),
                    backgroundColor: [
                        '#ff6347',
                        '#ffa500',
                        '#32cd32',
                        '#4ecdc4',
                        '#45b7d1',
                        '#96ceb4',
                        '#ffeaa7',
                        '#fd79a8'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 3,
                    hoverBorderColor: 'white'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            color: '#2c3e50', 
                            font: { size: 10 },
                            usePointStyle: true,
                            padding: 12
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return sortedAreas[context[0].dataIndex][0];
                            },
                            label: function(context) {
                                const [area, count] = sortedAreas[context.dataIndex];
                                const countries = cyberSecurityData.countries
                                    .filter(c => c.areas.includes(area))
                                    .map(c => c.name);
                                return [
                                    `${count} pays couvrent ce domaine`,
                                    `Pays: ${countries.slice(0, 3).join(', ')}${countries.length > 3 ? '...' : ''}`
                                ];
                            }
                        },
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white'
                    }
                }
            }
        });
    }
}

/**
 * Setup cybersecurity mode toggle
 */
function setupCybersecurityMode() {
    const cybersecurityBtn = document.getElementById('cybersecurity-mode');
    if (cybersecurityBtn) {
        cybersecurityBtn.addEventListener('click', function() {
            // Hide all analysis sections
            document.querySelectorAll('.analysis-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show cybersecurity analysis
            const cybersecurityAnalysis = document.getElementById('cybersecurity-analysis');
            if (cybersecurityAnalysis) {
                cybersecurityAnalysis.style.display = 'block';
            }
            
            // Update active button
            document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
            cybersecurityBtn.classList.add('active');
            toggleMapVisibility(false); // Hide map for cybersecurity analysis
            
            // Initialize charts if not already done
            if (typeof Chart !== 'undefined') {
                setTimeout(() => {
                    initializeCybersecurityCharts();
                }, 100);
            }
        });
    }
}

// Sovereignty challenges data from authentic tableau
const sovereigntyData = {
    challenges: [
        {
            id: 1,
            title: "Perte de terrain sur le Hardware",
            domain: "Technologie",
            impact: "Critique",
            details: "Dépendance totale aux composants électroniques importés (puces, serveurs, équipements réseau). Absence d'industries locales de fabrication.",
            consequences: "Vulnérabilité aux ruptures d'approvisionnement, coûts élevés, impossibilité de contrôler la chaîne technologique, espionnage potentiel via hardware compromis."
        },
        {
            id: 2,
            title: "Absence dans l'écosystème des Logiciels",
            domain: "Technologie", 
            impact: "Critique",
            details: "Marginalisation dans le développement d'OS, applications stratégiques, IA et solutions cloud. Consommation passive de solutions externes.",
            consequences: "Perte de souveraineté numérique, dépendance technologique, fuite de données vers l'étranger, innovation locale freinée."
        },
        {
            id: 3,
            title: "Maîtrise insuffisante des politiques numériques",
            domain: "Politique",
            impact: "Élevé",
            details: "Services numériques échappant au contrôle réglementaire africain. Politiques inadaptées ou inexistantes face aux enjeux digitaux.",
            consequences: "Évasion fiscale des géants du numérique, protection des données insuffisante, concurrence déloyale pour les entreprises locales."
        },
        {
            id: 4,
            title: "Droit du Cyberespace abusif ou restrictif",
            domain: "Gouvernance",
            impact: "Élevé",
            details: "Législations souvent répressives ou inadaptées freinant l'innovation. Déséquilibre entre sécurité nationale et libertés numériques.",
            consequences: "Fuite des talents, investissements tech découragés, innovation bridée, censure numérique, climat d'affaires dégradé."
        },
        {
            id: 5,
            title: "Retard dans la politique souverainiste",
            domain: "Gouvernance",
            impact: "Critique",
            details: "Absence de stratégies nationales cohérentes pour la souveraineté numérique. Politiques publiques inadaptées aux enjeux géopolitiques du numérique.",
            consequences: "Dépendance technologique perpétuée, vulnérabilité aux pressions externes, perte de contrôle stratégique, retard dans l'autonomie numérique."
        },
        {
            id: 6,
            title: "Vulnérabilité des systèmes informatiques",
            domain: "Technologie",
            impact: "Critique",
            details: "Cybersécurité défaillante, systèmes obsolètes, manque d'expertise locale en sécurité informatique.",
            consequences: "Cyberattaques fréquentes, vol de données, paralysie des services publics, coûts de remédiation élevés, perte de confiance."
        },
        {
            id: 7,
            title: "Dépendance infrastructurelle critique",
            domain: "Technologie",
            impact: "Élevé",
            details: "Dépendance totale aux câbles sous-marins, satellites et infrastructures externes. Fragilité du réseau continental.",
            consequences: "Risques de coupures massives, coûts de connectivité élevés, vulnérabilité aux pressions géopolitiques, isolement numérique possible."
        },
        {
            id: 8,
            title: "Retard de la Vision politique stratégique",
            domain: "Politique",
            impact: "Élevé",
            details: "Manque de leadership numérique continental. Absence de stratégies à long terme et de coordination inter-États.",
            consequences: "Fragmentation des efforts, duplication des investissements, perte d'opportunités, faible poids dans les négociations internationales."
        },
        {
            id: 9,
            title: "Absence aux négociations mondiales",
            domain: "Gouvernance",
            impact: "Moyen",
            details: "Marginalisation dans les instances internationales de gouvernance numérique. Subir les décisions prises ailleurs.",
            consequences: "Standards imposés défavorables, exclusion des marchés numériques, réglementations subies, perte d'influence géopolitique."
        },
        {
            id: 10,
            title: "Addiction consommation vs Innovation",
            domain: "Économie",
            impact: "Moyen",
            details: "Culture de consommation passive des technologies. Fuite des cerveaux et sous-investissement dans la R&D technologique.",
            consequences: "Économie numérique extractive, création de valeur limitée, dépendance technologique perpétuée, potentiel d'innovation gaspillé."
        }
    ]
};

/**
 * Populate sovereignty challenges table
 */
function populateSovereigntyTable() {
    const tableBody = document.getElementById('sovereignty-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    sovereigntyData.challenges.forEach(challenge => {
        const row = document.createElement('tr');
        
        // Domain badge styling
        let domainBadgeClass = 'domain-badge ';
        switch(challenge.domain) {
            case 'Technologie': domainBadgeClass += 'tech-badge'; break;
            case 'Politique': domainBadgeClass += 'policy-badge'; break;
            case 'Gouvernance': domainBadgeClass += 'governance-badge'; break;
            case 'Économie': domainBadgeClass += 'economic-badge'; break;
        }
        
        // Impact badge styling
        let impactBadgeClass = 'impact-badge ';
        switch(challenge.impact) {
            case 'Critique': impactBadgeClass += 'impact-critique'; break;
            case 'Élevé': impactBadgeClass += 'impact-eleve'; break;
            case 'Moyen': impactBadgeClass += 'impact-moyen'; break;
        }
        
        row.innerHTML = `
            <td><div class="point-number">${challenge.id}</div></td>
            <td>
                <div class="challenge-title">${challenge.title}</div>
            </td>
            <td><span class="${domainBadgeClass}">${challenge.domain}</span></td>
            <td><span class="${impactBadgeClass}">${challenge.impact}</span></td>
            <td>
                <div class="details-text">${challenge.details}</div>
                <div class="consequences">
                    <div class="consequences-title">⚠️ Conséquences :</div>
                    <div class="consequences-text">${challenge.consequences}</div>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Setup sovereignty mode toggle
 */
function setupSovereigntyMode() {
    const sovereigntyBtn = document.getElementById('sovereignty-mode');
    if (sovereigntyBtn) {
        sovereigntyBtn.addEventListener('click', function() {
            // Hide all analysis sections
            document.querySelectorAll('.analysis-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show sovereignty analysis
            const sovereigntyAnalysis = document.getElementById('sovereignty-analysis');
            if (sovereigntyAnalysis) {
                sovereigntyAnalysis.style.display = 'block';
            }
            
            // Update active button
            document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
            sovereigntyBtn.classList.add('active');
            toggleMapVisibility(false); // Hide map for sovereignty analysis
            
            // Populate table if not already done
            populateSovereigntyTable();
        });
    }
}

/**
 * Setup Abidjan Declaration mode toggle
 */
function setupAbidjanMode() {
    const abidjanBtn = document.getElementById('abidjan-mode');
    if (abidjanBtn) {
        abidjanBtn.addEventListener('click', function() {
            // Hide all analysis sections
            document.querySelectorAll('.analysis-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show Abidjan analysis
            const abidjanAnalysis = document.getElementById('abidjan-analysis');
            if (abidjanAnalysis) {
                abidjanAnalysis.style.display = 'block';
            }
            
            // Update active button
            document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
            abidjanBtn.classList.add('active');
            toggleMapVisibility(false); // Hide map for Abidjan analysis
        });
    }
}

/**
 * Show/hide map section and legend based on mode
 */
function toggleMapVisibility(showMap) {
    const mapSection = document.querySelector('.map-section');
    const legend = document.querySelector('.legend');
    const statsSection = document.querySelector('.stats-section');
    
    if (mapSection) {
        if (showMap) {
            mapSection.classList.remove('hidden');
        } else {
            mapSection.classList.add('hidden');
        }
    }
    
    if (legend) {
        if (showMap) {
            legend.classList.remove('hidden');
        } else {
            legend.classList.add('hidden');
        }
    }
    
    if (statsSection) {
        if (showMap) {
            statsSection.classList.remove('hidden');
        } else {
            statsSection.classList.add('hidden');
        }
    }
}

/**
 * Update hover statistics display
 */
function updateHoverStatistics(countryData, countryName) {
    const hoverStatsElement = document.getElementById('hover-stats');
    if (!hoverStatsElement) return;
    
    const dominantOperator = countryData.operators[0] || 'N/A';
    const marketShare = dominantOperator.includes('-') ? 
        dominantOperator.split('-').pop().trim() : 'N/A';
    
    hoverStatsElement.innerHTML = `
        <div class="hover-stats-content">
            <h4 class="hover-country-name">${countryName}</h4>
            <div class="hover-stat-item">
                <span class="hover-stat-label">Opérateur dominant:</span>
                <span class="hover-stat-value">${dominantOperator.split('-')[0].trim()}</span>
            </div>
            <div class="hover-stat-item">
                <span class="hover-stat-label">Part de marché:</span>
                <span class="hover-stat-value">${marketShare}</span>
            </div>
            <div class="hover-stat-item">
                <span class="hover-stat-label">Dépendance étrangère:</span>
                <span class="hover-stat-value">${countryData.dependency}</span>
            </div>
            <div class="hover-stat-item">
                <span class="hover-stat-label">Couverture 4G:</span>
                <span class="hover-stat-value">${countryData.coverage ? countryData.coverage['4G'] : 'N/A'}</span>
            </div>
        </div>
    `;
    hoverStatsElement.style.display = 'block';
}

/**
 * Clear hover statistics display
 */
function clearHoverStatistics() {
    const hoverStatsElement = document.getElementById('hover-stats');
    if (hoverStatsElement) {
        hoverStatsElement.style.display = 'none';
    }
}

/**
 * Setup new modes section navigation
 */
function setupNewModesNavigation() {
    // Setup navigation for data-analysis links
    const analysisButtons = document.querySelectorAll('[data-analysis]');
    const aboutButton = document.querySelector('[data-target="about"]');
    
    analysisButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const mode = button.getAttribute('data-analysis');
            
            // Remove active class from all navigation items
            document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update body class for mode-specific styling (legend visibility)
            document.body.className = '';
            document.body.classList.add(`mode-${mode.replace('-mode', '')}`);
            
            // Hide all sections
            const allSections = document.querySelectorAll('.analysis-section, #about, #home');
            allSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the requested analysis section
            switch(mode) {
                case 'isp-mode':
                    const ispAnalysis = document.getElementById('isp-analysis');
                    if (ispAnalysis) {
                        ispAnalysis.style.display = 'block';
                    }
                    toggleMapVisibility(true); // Show map for ISP analysis
                    break;
                case 'governance-mode':
                    const governanceAnalysis = document.getElementById('governance-analysis');
                    if (governanceAnalysis) {
                        governanceAnalysis.style.display = 'block';
                    }
                    toggleMapVisibility(false); // Hide map
                    
                    if (typeof Chart !== 'undefined') {
                        setTimeout(() => {
                            initializeGovernanceCharts();
                            generateGovernanceCountryCards();
                        }, 100);
                    }
                    break;
                case 'infrastructure-mode':
                    const infrastructureAnalysis = document.getElementById('infrastructure-analysis');
                    if (infrastructureAnalysis) {
                        infrastructureAnalysis.style.display = 'block';
                    }
                    toggleMapVisibility(false); // Hide map
                    break;
                case 'cybersecurity-mode':
                    const cybersecurityAnalysis = document.getElementById('cybersecurity-analysis');
                    if (cybersecurityAnalysis) {
                        cybersecurityAnalysis.style.display = 'block';
                    }
                    toggleMapVisibility(false); // Hide map
                    
                    if (typeof Chart !== 'undefined') {
                        setTimeout(() => {
                            initializeCybersecurityCharts();
                        }, 100);
                    }
                    break;
                case 'sovereignty-mode':
                    const sovereigntyAnalysis = document.getElementById('sovereignty-analysis');
                    if (sovereigntyAnalysis) {
                        sovereigntyAnalysis.style.display = 'block';
                    }
                    toggleMapVisibility(false); // Hide map
                    
                    setTimeout(() => {
                        populateSovereigntyTable();
                    }, 100);
                    break;
                case 'abidjan-mode':
                    const abidjanAnalysis = document.getElementById('abidjan-analysis');
                    if (abidjanAnalysis) {
                        abidjanAnalysis.style.display = 'block';
                    }
                    toggleMapVisibility(false); // Hide map
                    break;
            }
        });
    });
    
    // Handle About button
    if (aboutButton) {
        aboutButton.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
            aboutButton.classList.add('active');
            
            document.body.className = 'mode-about';
            
            const allSections = document.querySelectorAll('.analysis-section, #home');
            allSections.forEach(section => {
                section.style.display = 'none';
            });
            
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.style.display = 'block';
            }
            toggleMapVisibility(false);
        });
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    if (map) {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
});

/**
 * Setup navigation menu functionality
 */
function setupNavigationMenu() {
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    // Handle main navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if this is a dropdown parent
            const parentItem = this.closest('.nav-item.dropdown');
            if (parentItem) {
                e.preventDefault();
                
                // Toggle dropdown on mobile
                if (window.innerWidth <= 768) {
                    parentItem.classList.toggle('active');
                    return;
                }
                
                // On desktop, just scroll to analyses section
                scrollToSection('modes-section');
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const target = this.getAttribute('data-target');
            
            // Handle navigation based on target
            switch(target) {
                case 'home':
                    scrollToSection('header');
                    break;
                case 'analyses':
                    scrollToSection('modes-section');
                    break;
                case 'carte':
                    scrollToSection('map-section');
                    break;
                case 'about':
                    scrollToSection('header');
                    break;
            }
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    });
    
    // Handle dropdown link clicks
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const analysisMode = this.getAttribute('data-analysis');
            const analysisBtn = document.getElementById(analysisMode);
            
            if (analysisBtn) {
                // Scroll to the analyses section first
                scrollToSection('modes-section');
                
                // Then trigger the analysis mode after a short delay
                setTimeout(() => {
                    analysisBtn.click();
                }, 300);
            }
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
            
            // Close dropdown on mobile
            dropdownItems.forEach(item => item.classList.remove('active'));
        });
    });
    
    // Handle mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navigation-menu')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            // Also close all dropdowns
            dropdownItems.forEach(item => item.classList.remove('active'));
        }
    });
    
    // Handle scroll to update active nav item
    window.addEventListener('scroll', updateActiveNavItem);
}

/**
 * Scroll to specific section smoothly
 */
function scrollToSection(sectionClass) {
    const section = document.querySelector(`.${sectionClass}`);
    if (section) {
        const offsetTop = section.offsetTop - 100; // Account for fixed nav
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

/**
 * Update active navigation item based on scroll position
 */
function updateActiveNavItem() {
    const sections = [
        { class: 'header', nav: 'home' },
        { class: 'modes-section', nav: 'analyses' },
        { class: 'map-section', nav: 'carte' }
    ];
    
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
        const element = document.querySelector(`.${section.class}`);
        if (element) {
            const offsetTop = element.offsetTop;
            const offsetBottom = offsetTop + element.offsetHeight;
            
            if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
                // Update active nav item
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-target') === section.nav) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing ECOWAS ISP Dominance Map...');
    
    // Setup navigation menu
    setupNavigationMenu();
    
    // Load governance data first
    loadGovernanceData().then(() => {
        // Initialize the map after governance data is loaded
        initializeMap();
        
        // Update statistics
        updateStatistics();
        
        // Setup mode toggle functionality
        setupModeToggle();
        
        // Setup new modes navigation  
        setupNewModesNavigation();
        
        // Initialize governance charts when Chart.js is available
        if (typeof Chart !== 'undefined') {
            setTimeout(() => {
                initializeGovernanceCharts();
                generateGovernanceCountryCards();
                initializeCybersecurityCharts();
                populateSovereigntyTable();
            }, 500);
        }
    }).catch(error => {
        console.error('Error loading governance data:', error);
        showError('Failed to load governance data');
    });
});
