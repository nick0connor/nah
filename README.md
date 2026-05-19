# NaH - Netflix at Home

<p align="center">
<img width="190" height="190" alt="Image" src="https://github.com/user-attachments/assets/5284f454-0e81-4b2d-8304-cc0aa06fc642" />
</p>

This is an all-in-one tool for torrent searching and installation, specifically for use with another service like Plex or Jellyfin. 

Please note: This tool was developed for educational purposes and will thus not have the same rigidity that can be found in similar products/programs. It has been tested, but definitely not to exhaustion. 

<hr>

If you would like to set this up for yourself:

1) Install NaH to whatever device is hosting your Plex/Jellyfin server
2) Run `npm run install:all` to get all necessary packages for client and server at once
4) Build the frontend with `npm run build`
5) Start the program with `npm start`

The first time you go to the WebUI for the program, you should be redirected to the `/settings` page where you can input the file paths to your Movies and TV folders. If for whatever reason you are not automatically redirected, use the gear icon in the top left.

<hr>

There's still a good amount of things I want to do with this project. The list currently includes

- Adding pages and modular # of results for search feature
- Adding a timeout feature to prevent hanging on a dead torrent
- Triggering a Plex library refresh after download is complete
- Rewrite code to not be made of toothpicks held together with chewing gum
