var SynthPad = (function() {
  // Variables
  var synthesizer;
  
  // create var to change the volume and frequency during the mouseclick
  var frequency;
  var volume;

  var myAudioContext;
  var oscillator;
  var gainNode;


  // Notes
  var lowNote = 261.63; // C4
  var highNote = 493.88; // B4
 


  // Constructor
  var SynthPad = function() {
    synthesizer = document.getElementById('synth-pad');
    frequency = document.getElementById('frequency');
    volume = document.getElementById('volume');
  
    // Create an audio context.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    myAudioContext = new window.AudioContext();
  
    SynthPad.setupEventListeners();
  };
  
  
  // Event Listeners
  SynthPad.setupEventListeners = function() {

    synthesizer.addEventListener('mousedown', SynthPad.playSound);
  
    synthesizer.addEventListener('mouseup', SynthPad.stopSound);
    document.addEventListener('mouseleave', SynthPad.stopSound);
  };
  
  // Play a note.
  SynthPad.playSound = function(event) {
    oscillator = myAudioContext.createOscillator();
    gainNode = myAudioContext.createGain();
  
    oscillator.type = 'triangle';
  
    gainNode.connect(myAudioContext.destination);
    oscillator.connect(gainNode);
  
    SynthPad.updateFrequency(event);
  
    oscillator.start(0);
  
    synthesizer.addEventListener('mousemove', SynthPad.updateFrequency);
    synthesizer.addEventListener('mouseout', SynthPad.stopSound);
  };
  
  
  // Stop the audio.
  SynthPad.stopSound = function(event) {
    oscillator.stop(0);
  
    synthesizer.removeEventListener('mousemove', SynthPad.updateFrequency);
    synthesizer.removeEventListener('mouseout', SynthPad.stopSound);
  };
   
  
  // Calculate the note frequency.
  SynthPad.calculateNote = function(posX) {
    var noteDifference = highNote - lowNote;
    var noteOffset = (noteDifference / synthesizer.offsetWidth) * (posX - synthesizer.offsetLeft);
    return lowNote + noteOffset;
  };
  
  
  // Calculate the volume.
  SynthPad.calculateVolume = function(posY) {
    var volumeLevel = 1 - (((100 / synthesizer.offsetHeight) * (posY - synthesizer.offsetTop)) / 100);
    return volumeLevel;
  };
  
  
  // Fetch the new frequency and volume.
  SynthPad.calculateFrequency = function(x, y) {
    var noteValue = SynthPad.calculateNote(x);
    var volumeValue = SynthPad.calculateVolume(y);
  
    oscillator.frequency.value = noteValue;
    gainNode.gain.value = volumeValue;
  
    frequency.innerHTML = Math.floor(noteValue) + ' Hz';
    volume.innerHTML = Math.floor(volumeValue * 100) + '%';
  };
  
  
  // Update the note frequency.
  SynthPad.updateFrequency = function(event) {
    if (event.type == 'mousedown' || event.type == 'mousemove') {
      SynthPad.calculateFrequency(event.x, event.y);
    }
  };
  
  // Export SynthPad.
  return SynthPad;
})();


// Initialize the page.
window.onload = function() {
  var synthPad = new SynthPad();
}

  // Variables for the circle
const canvas = document.querySelector('#synth-pad');
const context = canvas.getContext('2d');
const objects = new Set();

window.addEventListener('mousedown', onMouseDown);

function getTime() {
    return 0.001 * (new Date().getTime());
}

 //if mousedown draw circle
function onMouseDown(evt) {
    const time = getTime();
    const circle = new AnimatedObject(time, evt.clientX - 322, evt.clientY - 75);
    objects.add(circle);
    
    evt.preventDefault();
}

class AnimatedObject {
    constructor(time, x, y) {
        this.time = time;
        this.x = x;
        this.y = y;
    }
    
    // draw circle 
    draw(time) {
        const maxDuration = 3;
        const maxRadius = 250;
        const actualDuration = time - this.time;
        const relativeDuration = actualDuration / maxDuration;
        
        if (relativeDuration < 1) {
            const radius = maxRadius * relativeDuration;
            
            context.strokeStyle = '#fff';
            context.lineWidth = 4;
            context.globalAlpha = 1 - relativeDuration;
            
            context.beginPath();
            context.arc(this.x, this.y, radius, 0,2* Math.PI);
            context.stroke();
            
            return true;
        }
        return false;
    }
}

  //Set the settings of the circle
function animateCircles() {
    const time = getTime();
    context.strokeStyle = '#fff';
    context.globalAlpha = 0.1;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let circle of objects) {
        const cont = circle.draw(time);
        
        if (cont == false)
            objects.delete(circle);
    }
    requestAnimationFrame(animateCircles);
}

animateCircles();