import argparse
import ffmpeg


# Converts one input audio file into an mp3 file.
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("output")
    parser.add_argument('-ab', '--audio_bitrate', default='128k')
    parser.add_argument('-ar', '--audio_sample_rate', default='44100')


    args = parser.parse_args()

    convert_wav_to_mp3(args)


def convert_wav_to_mp3(args):
    stream = ffmpeg.input(args.input)
    stream = ffmpeg.output(stream, args.output, ab=args.audio_bitrate, ac=2, ar=args.audio_sample_rate, format='mp3')
    ffmpeg.run(stream)


if __name__ == '__main__':
    main()
