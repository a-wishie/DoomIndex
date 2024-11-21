from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import json

app = Flask(__name__)
CORS(app)

# Load data
DATA_PATH = os.path.join(os.path.dirname(__file__), "public", "data.csv")
GEOJSON_PATH = os.path.join(os.path.dirname(__file__), "public", "geojson", "countries.geo.json")

def load_data():
    try:
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(f"Data file not found at {DATA_PATH}")
        df = pd.read_csv(DATA_PATH)
        # Add preprocessing if needed
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

def load_geojson():
    try:
        if not os.path.exists(GEOJSON_PATH):
            raise FileNotFoundError(f"GeoJSON file not found at {GEOJSON_PATH}")
        with open(GEOJSON_PATH, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading GeoJSON: {e}")
        return None

df = load_data()
geojson_data = load_geojson()

@app.route('/api/available-years', methods=['GET'])
def get_available_years():
    country = request.args.get('country')
    disaster_type = request.args.get('disasterType')
    
    if not country or not disaster_type:
        return jsonify({"error": "Missing parameters"}), 400
    
    if df is None:
        return jsonify({"error": "Data not loaded"}), 500
    
    filtered_df = df[
        (df['ISO'] == country) & 
        (df['Disaster Type'] == disaster_type)
    ]
    available_years = sorted(filtered_df['Start Year'].dropna().astype(int).unique().tolist())
    return jsonify(available_years)

@app.route('/api/disasters', methods=['GET'])
def get_disasters():
    country = request.args.get('country')
    year = request.args.get('year')
    disaster_type = request.args.get('type')
    
    if not country or not year or not disaster_type:
        return jsonify({"error": "Missing parameters"}), 400
    
    if df is None:
        return jsonify({"error": "Data not loaded"}), 500
    
    filtered_df = df[
        (df['ISO'] == country) & 
        (df['Start Year'] == int(year)) & 
        (df['Disaster Type'] == disaster_type)
    ]
    if filtered_df.empty:
        return jsonify([]), 404
    
    results = filtered_df.to_dict('records')
    return jsonify(results)

@app.route('/api/geojson/<country_code>', methods=['GET'])
def get_geojson(country_code):
    try:
        if geojson_data is None:
            return jsonify({"error": "GeoJSON not loaded"}), 500
        
        filtered_geojson = {
            "type": "FeatureCollection",
            "features": [
                feature for feature in geojson_data['features']
                if feature['id'] == country_code.upper()
            ]
        }
        return jsonify(filtered_geojson)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)