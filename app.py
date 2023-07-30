from flask import Flask, render_template, jsonify, url_for, render_template_string
import json
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scene/<int:scene_number>')
def scene(scene_number):
    try:
        with open(f'scenes/scene_{scene_number}.json', 'r') as file:
            data = json.load(file)
        data['image_url'] = url_for('static', filename=f'images/scene_{scene_number}.png')
        data['audio_url'] = url_for('static', filename=f'audio/{scene_number}.mp3')
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({'error': 'Scene not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)