# Web Video Editor

A simple web-based (proof of concept) video editor built with React and [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm).

## Features
- Basic video trimming and editing
- Uses `ffmpeg.wasm` for in-browser processing
- Web-based, no installation required
- {{{Simple}}} UI

## Known Issues & Limitations
Despite its {{{usefulness}}}, this project has several limitations and issues:

### Performance Issues
- **Very slow processing** for long videos or high-resolution files.
- **Multithreading support is unreliable**, as the multi-threaded version of `ffmpeg.wasm` does not work correctly across all browsers.

### Format Support
- Not all video formats work correctly.
- **WebM files are currently not supported**.

### UI & UX Limitations
- **The UI is ~~extremely scuffed~~ not fully optimized**, especially on mobile devices.
- **Some UI elements may not respond properly** under special circumstances.

### Functionality Issues
- **Not all features work consistently across different file types.** Certain editing functions may fail depending on the input file format.
- Expect unexpected **errors**.
- More at: [ffmpeg-webm](https://github.com/ffmpegwasm/ffmpeg.wasm).

## Future Improvements
- .

## Contributing
If you'd like to contribute to this project, feel free to submit a pull request or report issues in the repository.

## License
This project is licensed under the MIT License.

