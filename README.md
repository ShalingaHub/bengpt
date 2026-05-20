# Ben GPT Website

This repository contains a static HTML/CSS/JS website for Ben GPT.
It can be published using GitHub Pages so friends can access it over the web.

## Publish on GitHub Pages

1. Create a new repository on GitHub.
2. Push all files from this folder (`index.html`, `chat.html`, `house.mp3`, `surfer.mp4`, `serve.bat`, `serve.ps1`, etc.) to the repository.
3. Open the repository on GitHub.
4. Go to `Settings` > `Pages`.
5. Under `Source`, select `main` branch and `/(root)` folder, then save.
6. Wait a minute. GitHub will give you a URL like:

   `https://<your-username>.github.io/<repo-name>/`

7. Share that URL with your friends.

## Notes

- `index.html` is the landing page.
- `chat.html` is the chat page.
- `surfer.mp4` and `house.mp3` are used by the chat page.
- The site should work in Safari, Chrome, and other modern browsers.

## Troubleshooting

- If the homepage loads but the chat page does not, make sure the files are all in the repository root.
- If the audio or video does not play immediately, Safari may require user interaction before autoplay.
- If you want the site to load at the repository root, keep the files at the top level and do not use nested folders.
