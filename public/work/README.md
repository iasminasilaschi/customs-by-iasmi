# Photos & videos for the site

One folder per piece:

    public/work/<piece-slug>/
        cover.jpg          <- the main photo (cards + top of the page)
        01.jpg 02.jpg ...  <- finished-piece photos
        making-01.jpg ...  <- process / behind-the-scenes photos
        making.mp4         <- optional short video (under ~20 MB)
        making-poster.jpg  <- optional still shown before the video plays

Don't resize by hand. Drop the originals (phone photos are fine) into a folder
and run:

    npm run media:prepare -- ~/Pictures/one-piece-raw public/work/one-piece-sneakers

That makes web-sized, correctly rotated copies (and shrinks any .mp4/.mov).
