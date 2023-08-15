import ffmpeg

def convert_wav_to_mp3(input_file, output_file):
    stream = ffmpeg.input(input_file)
    stream = ffmpeg.output(stream, output_file, ab='128k', ac=2, ar='44100', format='mp3')
    ffmpeg.run(stream)

input_file = 'static/voiceover/voice.m4a'
output_file = 'static/voiceover/voice.mp3'

convert_wav_to_mp3(input_file, output_file)