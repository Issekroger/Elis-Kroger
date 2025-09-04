const gallery = document.querySelector(".video-gallery");

fetch("/api/gallery")
  .then(res => res.json())
  .then(items => {
    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "gallery-item";

      if (item.type === "video") {
        div.innerHTML = `
          <img class="thumbnail" src="${item.poster}" alt="thumbnail">
          <video src="${item.src}" muted loop preload="auto" playsinline></video>
        `;
        const video = div.querySelector("video");
        const thumbnail = div.querySelector("img.thumbnail");

        function setHeight() {
          let aspectRatio = 9 / 16;
          if (video.videoWidth && video.videoHeight) {
            aspectRatio = video.videoHeight / video.videoWidth;
          } else if (thumbnail.naturalWidth && thumbnail.naturalHeight) {
            aspectRatio = thumbnail.naturalHeight / thumbnail.naturalWidth;
          }
          div.style.height = div.offsetWidth * aspectRatio + "px";
        }

        if (thumbnail.complete) setHeight();
        else thumbnail.addEventListener("load", setHeight);
        video.addEventListener("loadedmetadata", setHeight);
        window.addEventListener("resize", setHeight);

        div.addEventListener("mouseenter", () => video.play().catch(() => {}));
        div.addEventListener("mouseleave", () => { video.pause(); video.currentTime = 0; });

      } else if (item.type === "image") {
        div.innerHTML = `<img src="${item.src}" alt="image">`;
        const img = div.querySelector("img");
        img.style.width = "100%";
        img.style.display = "block";

        function setHeight() {
          if(img.naturalWidth && img.naturalHeight) {
            const aspectRatio = img.naturalHeight / img.naturalWidth;
            div.style.height = div.offsetWidth * aspectRatio + "px";
          }
        }

        if(img.complete) setHeight();
        else img.addEventListener("load", setHeight);
        window.addEventListener("resize", setHeight);
      }

      gallery.appendChild(div);
    });
  });

  