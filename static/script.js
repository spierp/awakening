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
let isModalOpen = false;
let voiceoverAudio = document.getElementById('voiceover-audio');
let voiceoverAudioSource = document.getElementById('voiceover-audio-source');
let backgroundSound = null;
let audioContext = Howler.ctx;
let currentBackgroundSoundURL = null; // Add this state variable at the beginning

let inventory = [];

function addItemToInventory(item) {
    if (!inventory.includes(item)) {
        inventory.push(item);
        console.log("Added item:", item);
        if (!isModalOpen) {
            renderInventory();
        }
    }
}

function renderInventory() {
    console.log("Rendering Inventory"); // Add this
    const container = document.getElementById('inventory');
    container.innerHTML = ''; // Clear the current inventory
    inventory.forEach(item => {
        const img = document.createElement('img');
        img.src = `/static/images/${item}_inv.png`; // Path to your icons
        img.classList.add('inventory-icon');
        container.appendChild(img);
    });
}

document.getElementById('closeModal').addEventListener('click', function() {
    modal.style.opacity = "0";
    isModalOpen = false;  // set it to false when closing
    setTimeout(function() {
        modal.style.display = "none";
    }, 1000);
    if (currentSceneData) {
        // Load the options once the modal is closed
        loadOptions(currentSceneData.options);

        // If the current scene has a modal with an inventory item, add it to the inventory
        if (currentSceneData.modal && currentSceneData.modal.inventory_item) {
            addItemToInventory(currentSceneData.modal.inventory_item);
        }
    }
});

function applyKenBurnsEffect(data) {
    let video = document.getElementById('background-video');

    // First, reset any animation:
    video.style.animation = 'none';

    // Force reflow. This helps in re-triggering the animation.
    video.offsetWidth; 

    if (data.kenBurns) {
        video.style.setProperty('--startScale', data.kenBurns.startScale);
        video.style.setProperty('--endScale', data.kenBurns.endScale);
        video.style.setProperty('--startPosition', data.kenBurns.startPosition);
        video.style.setProperty('--endPosition', data.kenBurns.endPosition);
        video.style.animation = `kenBurns ${data.kenBurns.duration} forwards`;
    }
}

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

    // Filter options based on inventory
    const availableOptions = options.filter(option => {
        // If the option doesn't specify an inventory item, or if it does and the player has that item, include the option
        return !option.inventory_item || inventory.includes(option.inventory_item);
    });
    
    for (let i = 0; i < availableOptions.length; i++) {
        let option = availableOptions[i];

        let optionDiv = document.createElement('div');
        optionDiv.textContent = option.text;
        optionDiv.classList.add('option');

        optionDiv.addEventListener('click', function() {
            // Unmute the audio as the scene changes
            audio.muted = false;
            if (voiceoverAudio.currentTime > 0) { // Check if voiceover is playing
                voiceoverAudio.muted = false;
            }
        
            // Try to resume the AudioContext
            if (audioContext && audioContext.state && audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    console.log('AudioContext resumed successfully');
                }).catch((error) => {
                    console.error('Failed to resume AudioContext:', error);
                });
            }
        
            loadScene(option.nextScene);  // Continue with loading the scene
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

    setTimeout(() => {
        content.innerHTML = '';
        optionsContainer.innerHTML = '';

        fetch(`/scene/${sceneNumber}`)
        .then(response => {
            if (!response.ok) { throw response }
            return response.json()
        })
        .then(data => {
                currentSceneData = data; 

                // First, try to activate the AudioContext using the workaround:
                audio.addEventListener('canplay', function() {
                    audio.play().then(() => {
                        // Once the audio starts playing, unmute it after a short delay
                        setTimeout(() => {
                            audio.muted = false;
                        }, 100);
                    }).catch(error => {
                        console.error("Error playing audio:", error);
                    });
                });

                audioSource.src = data.audio_url;
                audio.load();
                audio.muted = true;

                // Now, proceed with loading your scene as usual
                voiceoverAudio.pause();
                video.src = data.video_url;

                if (data.audio_url && currentBackgroundSoundURL !== data.audio_url.trim()) {
                    if (backgroundSound) {
                        backgroundSound.unload();
                        console.log("background sound unloaded");
                    }
                
                    backgroundSound = new Howl({
                        src: [data.audio_url],
                        volume: 0.8,
                        loop: true
                    });
                    backgroundSound.play();
                
                    currentBackgroundSoundURL = data.audio_url.trim(); 
                }

                let positions = data.positions;

                titleSubtitleContainer.style.gridColumnStart = positions.title.column;
                titleSubtitleContainer.style.gridRowStart = positions.title.row;
        
                contentWrapper.style.gridColumnStart = positions.content.column;
                contentWrapper.style.gridRowStart = positions.content.row;
        
                optionsContainer.style.gridColumnStart = positions.options.column;
                optionsContainer.style.gridRowStart = positions.options.row;
                
                video.load();
                
                if (data.voiceover_url) {
                    // voiceoverSound.unload();
                    let voiceoverSound = new Howl({
                      src: [data.voiceover_url],
                      volume: 1.0
                    });
                    voiceoverSound.play();
                }

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

                applyKenBurnsEffect(data);

                setTimeout(() => {
                    titleSubtitleContainer.style.opacity = 1;
                
                    let typingTime = typeText(data.content);
                
                    if (data.modal && data.modal.image_url && data.modal.description) {
                        // Wait for the typing to finish before displaying the modal
                        setTimeout(() => {
                            modal.style.display = "block";
                            isModalOpen = true;  // set it to true when opening
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

