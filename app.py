from flask import Flask, render_template, jsonify, url_for
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

        if 'audio' in data:
            audio_path = data['audio']
            data['audio_url'] = url_for('static', filename=audio_path)

        voiceover_path = f'voiceover/scene_{scene_number}.mp3'
        if os.path.exists(f'static/{voiceover_path}'):
            data['voiceover_url'] = url_for('static', filename=voiceover_path)

        data['video_url'] = url_for('static', filename=f'video/scene_{scene_number}.mov')

        if 'modal' in data and 'image_url' in data['modal']:
            modal_image_path = data['modal']['image_url']
            data['modal']['image_url'] = url_for('static', filename=modal_image_path)

        return jsonify(data)
    except FileNotFoundError:
        return jsonify({'error': 'Scene not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)
