let scene = document.getElementById('scene');
let titleSubtitleContainer = document.getElementById('title-subtitle-container');  // new variable for the title and subtitle container
let content = document.getElementById('content');
let audio = document.getElementById('background-audio');
let audioSource = document.getElementById('background-audio-source');

function typeText(contentMessage, index = 0) {
    if (index < contentMessage.length) {
        content.innerHTML += contentMessage.charAt(index);
        setTimeout(() => typeText(contentMessage, index + 1), 50);
    }
}

function loadScene(sceneNumber) {
    const positions = {
        titleSubtitle: [
            {row: 2, column: 1}, // scene 1
            {row: 1, column: 2}, // scene 2
        ],
        content: [
            {row: 2, column: 2}, // scene 1
            {row: 2, column: 1}, // scene 2
        ],
    };

    titleSubtitleContainer.style.gridColumnStart = positions.titleSubtitle[sceneNumber - 1].column || 1;
    titleSubtitleContainer.style.gridRowStart = positions.titleSubtitle[sceneNumber - 1].row || 1;

    content.style.gridColumnStart = positions.content[sceneNumber - 1].column || 1;
    content.style.gridRowStart = positions.content[sceneNumber - 1].row || 1;

    // Fade out the current scene
    scene.style.opacity = 0;
    audio.pause();

    setTimeout(() => {
        fetch(`/scene/${sceneNumber}`)
            .then(response => {
                if (!response.ok) { throw response }
                return response.json()  // Back to using .json() since the scene files are now JSON
            })
            .then(data => {
                // Load the new scene
                console.log(data); // Add this line to log the data
                scene.style.backgroundImage = `url(${data.image_url})`;
                audioSource.src = data.audio_url;
                audio.load();

                // Fade in the new scene
                scene.style.opacity = 1;

                // Load the title and subtitle into the respective elements
                title.textContent = data.title;
                subtitle.textContent = data.subtitle;

                // Start typing the content
                typeText(data.content);

                // Start the audio after the new scene has faded in
                setTimeout(() => {
                    audio.play();
                }, 1000);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, 1000);
}

window.onload = function() {
    loadScene(1);
};
