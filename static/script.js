let scene = document.getElementById('scene');
let titleSubtitleContainer = document.getElementById('title-subtitle-container');
let content = document.getElementById('content');
let audio = document.getElementById('background-audio');
let audioSource = document.getElementById('background-audio-source');
let video = document.getElementById('background-video');
let videoSource = document.getElementById('video-source');
let modal = document.getElementById('modal');
let title = document.getElementById('title'); 
let subtitle = document.getElementById('subtitle');
let currentSceneData = null; 

document.getElementById('closeModal').addEventListener('click', function() {
    modal.style.opacity = "0";
    setTimeout(function() {
        modal.style.display = "none";
    }, 1000);
    if (currentSceneData) {
        // Load the options once the modal is closed
        loadOptions(currentSceneData.options);
    }
});

function typeText(text) {
    const content = document.getElementById('content');
    content.innerHTML = '';
    let i = 0;
    const typingSpeed = 50; // You can adjust this value to change the typing speed
    const interval = setInterval(() => {
        if (i < text.length) {
            let span = document.createElement('span');
            span.textContent = text[i];
            content.appendChild(span);
            i++;
        } else {
            clearInterval(interval);
        }
    }, typingSpeed);
    return text.length * typingSpeed; // Return the total typing time
}

function loadOptions(options) {
    let optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    for (let i = 0; i < options.length; i++) {
        let option = options[i];

        let optionDiv = document.createElement('div');
        optionDiv.textContent = option.text;
        optionDiv.classList.add('option');

        optionDiv.addEventListener('click', function() {
            loadScene(option.nextScene);
        });

        optionsContainer.appendChild(optionDiv);
    }

    // After options have been loaded, make the options-container visible
    setTimeout(() => {
        optionsContainer.style.opacity = 1;
    }, 500);
}


function loadScene(sceneNumber) {
    let optionsContainer = document.getElementById('options-container');
    let contentWrapper = document.getElementById('content-wrapper');

    scene.style.opacity = 0;
    titleSubtitleContainer.style.opacity = 0;
    audio.pause();

    setTimeout(() => {
        content.innerHTML = '';
        optionsContainer.innerHTML = '';

        fetch(`/scene/${sceneNumber}`)
        .then(response => {
            if (!response.ok) { throw response }
            return response.json()
        })
        .then(data => {
                currentSceneData = data; // Store the current scene data in the global variable    
                video.src = data.video_url;
                let positions = data.positions;

                titleSubtitleContainer.style.gridColumnStart = positions.title.column;
                titleSubtitleContainer.style.gridRowStart = positions.title.row;
        
                contentWrapper.style.gridColumnStart = positions.content.column;
                contentWrapper.style.gridRowStart = positions.content.row;
        
                optionsContainer.style.gridColumnStart = positions.options.column;
                optionsContainer.style.gridRowStart = positions.options.row;
                
                // scene.style.backgroundImage = `url(${data.image_url})`;
                videoSource.src = data.video_url;
                video.load();
                audioSource.src = data.audio_url;
                audio.load();
                
                if (data.modal && data.modal.image_url && data.modal.description) {
                    let modalImage = document.getElementById('modal-image');
                    let modalDescription = document.getElementById('modal-description');
                    
                    modalImage.src = data.modal.image_url;
                    modalDescription.textContent = data.modal.description;
                                    
                } else {
                    // If no modal data exists, hide the modal
                    modal.style.display = "none";
                }

                scene.style.opacity = 1;

                title.textContent = data.title;
                subtitle.textContent = data.subtitle;

                setTimeout(() => {
                    audio.play();
                }, 1000);

                setTimeout(() => {
                    titleSubtitleContainer.style.opacity = 1;
                
                    let typingTime = typeText(data.content);
                
                    if (data.modal && data.modal.image_url && data.modal.description) {
                        // Wait for the typing to finish before displaying the modal
                        setTimeout(() => {
                            modal.style.display = "block";
                            setTimeout(function() {
                                modal.style.opacity = "1";
                            }, 10); // A slight delay ensures the opacity transition takes effect.
                        }, typingTime + 1000);
                    } else {
                        // If there's no modal, load the options after typing completes
                        setTimeout(() => {
                            loadOptions(data.options);
                        }, typingTime);
                    }
                
                }, 2000);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, 1000);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('static/service-worker.js')
        .then(function(registration) {
          console.log('Service Worker registered with scope:', registration.scope);
        }, function(err) {
          console.log('Service Worker registration failed:', err);
        });
    });
  }

window.onload = function() {
    loadScene(1);
};

