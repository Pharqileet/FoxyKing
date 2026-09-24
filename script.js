/* =========================================================
   FOXYKING - script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const channelContainer = document.getElementById("channelLinks");
    const channelError = document.getElementById("channelError");
    const retryButton = document.getElementById("retryChannels");
    const currentYear = document.getElementById("currentYear");


    /* =====================================================
       YEAR
       ===================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       LOAD CHANNELS
       ===================================================== */

    async function loadChannels() {

        if (!channelContainer) return;

        channelContainer.innerHTML = `
            <div class="loading-channel">
                <span class="loader"></span>
                Loading...
            </div>
        `;

        if (channelError) {
            channelError.hidden = true;
        }


        try {

            const response = await fetch("data.json", {
                cache: "no-store"
            });


            if (!response.ok) {
                throw new Error(
                    `HTTP Error: ${response.status}`
                );
            }


            const data = await response.json();


            if (
                !data ||
                !Array.isArray(data.channels)
            ) {
                throw new Error(
                    "Invalid data.json structure"
                );
            }


            if (data.channels.length === 0) {

                channelContainer.innerHTML = `
                    <div class="loading-channel">
                        No channels available.
                    </div>
                `;

                return;
            }


            channelContainer.innerHTML = "";


            data.channels.forEach((channel) => {

                if (
                    !channel ||
                    !channel.name ||
                    !channel.url
                ) {
                    return;
                }


                const card = document.createElement("a");

                card.className = "channel-card";

                card.href = channel.url;

                card.target = "_blank";

                card.rel = "noopener noreferrer";


                const icon = document.createElement("div");

                icon.className = "channel-icon";

                icon.textContent =
                    channel.icon || "•";


                const info = document.createElement("div");

                info.className = "channel-info";


                const title = document.createElement("h3");

                title.textContent = channel.name;


                const description =
                    document.createElement("p");

                description.textContent =
                    channel.description || "";


                info.appendChild(title);
                info.appendChild(description);


                card.appendChild(icon);
                card.appendChild(info);


                channelContainer.appendChild(card);

            });


            if (!channelContainer.children.length) {
                throw new Error(
                    "No valid channels found"
                );
            }

        } catch (error) {

            console.error(
                "FOXYKING data.json error:",
                error
            );


            channelContainer.innerHTML = "";


            if (channelError) {
                channelError.hidden = false;
            }

        }
    }


    /* =====================================================
       RETRY
       ===================================================== */

    if (retryButton) {
        retryButton.addEventListener(
            "click",
            loadChannels
        );
    }


    /* =====================================================
       START
       ===================================================== */

    loadChannels();

});