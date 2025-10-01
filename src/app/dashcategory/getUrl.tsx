export function toEmbedUrl(url:any) {
  try {
    // handle short links like https://youtu.be/XZnPhiRhtdY?si=...
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // handle normal YouTube links like https://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url; // already in correct format
  } catch (e) {
    return url;
  }
}
