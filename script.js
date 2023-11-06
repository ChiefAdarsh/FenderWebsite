    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/zHJLUOy5Z/";

    let model, webcam, labelContainer, maxPredictions;

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

           // Initialize the labelContainer
    labelContainer = document.getElementById("label-container");

    // Reset the label to an empty string when initializing
    labelContainer.innerHTML = "";

    // Call the predict function to start video processing
    predict();
}

async function predict() {
    // Update the webcam video frame
    webcam.update();

    // Wait for the video frame to load
    requestAnimationFrame(async () => {
        const prediction = await model.predict(webcam.canvas);

        // Check for a crash condition (for example, if the probability of crash is greater than a threshold)
        const crashThreshold = 0.7;
        const crashDetected = prediction[0].probability > crashThreshold;

        // Update the label accordingly
        labelContainer.innerHTML = crashDetected ? "Crash Detected!" : "No Crash Detected";
        labelContainer.style.color = crashDetected ? "red" : "black"; // Set the color based on detection

        // Continue the loop by calling predict again
        predict();
    });
}

// Initialize the app
init();

  