// Buttons at the top
var pauseButton;
var playButton;
var stopButton;
var startSkip;
var endSkip;
var loopButton;
var recordButton;

//player
var player;

// low-pass filter
var cutoffFreq;
var resonance;
var lp_dryWet;
var lp_outputLevel;
var filterSelect;

//dynamic compressor
var attack;
var knee;
var release;
var ratio;
var threshold;
var dc_dryWet;
var dc_outputLevel;

//master volume
var masterVolume_slider;

//reverse
var reverbDuration;
var decayRate;
var reverb_reverse;
var r_dryWet;
var r_outputLevel;
var reversed;

//waveshaper distortion
var distortionAmount;
var oversample;
var oversampleDict = {0:"none", 1:"2x", 2:"4x"};
var wd_dryWet;
var wd_outputLevel;

//delay
var delayTime;
var feedback;
var d_dryWet;
var d_outputLevel;

//filters
var lowpassFilter;
var dynamicCompressor;
var masterVolume;
var reverbFilter;
var waveshaperDistortion;
var fftInput;
var fftOutput;
var delayFilter;


//recording
var outputFile;
var recording;
var recorder;

function preload()
{
    soundFormats('wav', 'mp3');
    player = loadSound("assets/poem");
    outputFile = new p5.SoundFile();
}

function setup()
{
    createCanvas(2000, 2000);
    background(180);
    GUI();
    filterSetup();
    recorderSetup();
    filterEffects();
}

//setup GUI
function GUI()
{
    //create and draw the buttons at the top
    pauseButton = createButton('pause');
    pauseButton.position(10, 10);

    playButton = createButton('play');
    playButton.position(90, 10);

    stopButton = createButton('stop')
    stopButton.position(170, 10);

    startSkip = createButton('skip to start');
    startSkip.position(250, 10);

    endSkip = createButton('skip to end');
    endSkip.position(360, 10);

    loopButton = createButton('loop');
    loopButton.position(480, 10);

    recordButton = createButton('record');
    recordButton.position(560, 10);

    //button functions
    pauseButton.mousePressed(() => player.pause());
    playButton.mousePressed(() => player.play());
    stopButton.mousePressed(() => player.stop());
    startSkip.mousePressed(() => player.jump(0));
    endSkip.mousePressed(() => player.jump(player.duration()));
    loopButton.mousePressed(() => player.loop());
    recordButton.mousePressed(() =>
    {
        if(!recording)
        {
            recording = true;
            recorder.record(outputFile);
            recordButton.style("background-color", "red");
            recordButton.html("stop recording");
        }
        else
        {
            recording = false;
            recorder.stop();
            save(outputFile, "output.wav");
            recordButton.style("background-color", "white");
            recordButton.html("record");
        }
    })

    //low-pass filter
    textSize(16);
    // text('low-pass filter', 110, 80);
    filterSelect = createSelect();
    filterSelect.position(110, 80)
    filterSelect.option('low-pass filter');
    filterSelect.option('high-pass filter');
    filterSelect.option('band-pass filter');


    textSize(12);
    text('cutoff frequency', 10, 120);
    cutoffFreq = createSlider(10, 22050, 22050, 10);
    cutoffFreq.position(10, 140);

    text('resonance', 190, 120);
    resonance = createSlider(0.001, 1000, 1000, 0.01);
    resonance.position(190, 140);

    text('dry/wet', 10, 200);
    lp_dryWet = createSlider(0, 1, 1, 0.01);
    lp_dryWet.position(10, 220);

    text('output level', 190, 200);
    lp_outputLevel = createSlider(0, 1, 1, 0.01);
    lp_outputLevel.position(190, 220);

    //dynamic compressor
    textSize(16);
    text('dynamic compressor', 660, 80);

    textSize(12);
    text('attack', 500, 120);
    attack = createSlider(0, 1, 0.003, 0.001);
    attack.position(500, 140);

    text('knee', 680, 120);
    knee = createSlider(0, 40, 30, 1);
    knee.position(680, 140);

    text('release', 860, 120);
    release = createSlider(0, 1, 0.25, 0.01);
    release.position(860, 140);

    text('ratio', 590, 200);
    ratio = createSlider(1, 20, 12, 1);
    ratio.position(590, 220);

    text('threshold', 770, 200);
    threshold = createSlider(-100, 0, -24, 1);
    threshold.position(770, 220);

    text('dry/wet', 590, 280);
    dc_dryWet = createSlider(0, 1, 1, 0.01);
    dc_dryWet.position(590, 300);

    text('output level', 770, 280);
    dc_outputLevel = createSlider(0, 1, 1, 0.01);
    dc_outputLevel.position(770, 300);

    //master volume
    textSize(16);
    text('master volume', 1100, 80);
    masterVolume_slider = createSlider(0, 1, 1, 0.01);
    masterVolume_slider.position(1100, 120);

    //reverb
    textSize(16);
    text('reverb', 110, 400);

    textSize(12);
    text('reverb duration', 10, 440);
    reverbDuration = createSlider(0, 10, 0, 0.1);
    reverbDuration.position(10, 460);

    text('decay rate', 190, 440);
    decayRate = createSlider(0, 100, 0, 1);
    decayRate.position(190, 460);

    reversed = false;
    reverb_reverse = createButton('reverse');
    reverb_reverse.position(110, 520);
    reverb_reverse.mousePressed(() =>
    {
        if(reversed == false)
        {
            reversed = true;
            reverb_reverse.style('background-color', "blue");
            reverb_reverse.html('reversed');
        }
        else
        {
            reversed = false;
            reverb_reverse.style('background-color', "white");
            reverb_reverse.html('reverse');
        }
    })

    text('dry/wet', 10, 600);
    r_dryWet = createSlider(0, 1, 1, 0.01);
    r_dryWet.position(10, 620);

    text('output level', 190, 600);
    r_outputLevel = createSlider(0, 1, 1, 0.01);
    r_outputLevel.position(190, 620);

    //waveshaper distortion
    textSize(16);
    text('waveshaper distortion', 560, 400);

    textSize(12);
    text('distortion amount', 500, 440);
    distortionAmount = createSlider(0, 1, 0, 0.01);
    distortionAmount.position(500, 460);

    text('oversample', 680, 440);
    oversample = createSlider(0, 2, 0, 1);
    oversample.position(680, 460);

    text('dry/wet', 500, 520);
    wd_dryWet = createSlider(0, 1, 1, 0.01);
    wd_dryWet.position(500, 540);

    text('output level', 680, 520);
    wd_outputLevel = createSlider(0, 1, 1, 0.01);
    wd_outputLevel.position(680, 540);

    //waveform
    textSize(16);
    text('spectrum in', 1100, 400);
    text('spectrum out', 1100, 580);

    //delay
    textSize(16);
    text('Delay', 110, 680);

    textSize(12);
    text('delay time', 10, 720);
    delayTime = createSlider(0, 1, 0.5, 0.01);
    delayTime.position(10, 740);

    text('feedback', 190, 720);
    feedback = createSlider(0, 1, 0.5, 0.01);
    feedback.position(190, 740);

    text('dry/wet', 10, 800);
    d_dryWet = createSlider(0, 1, 1, 0.01);
    d_dryWet.position(10, 820);

    text('output level', 190, 800);
    d_outputLevel = createSlider(0, 1, 1, 0.01);
    d_outputLevel.position(190, 820);
}

// set up filters
function filterSetup()
{
    //set up filters
    lowpassFilter = new p5.Filter();
    dynamicCompressor = new p5.Compressor();
    masterVolume = new p5.Gain();
    reverbFilter = new p5.Reverb();
    waveshaperDistortion = new p5.Distortion();
    delayFilter = new p5.Delay();

    //set up spectrum
    fftInput = new p5.FFT();
    fftOutput = new p5.FFT();

    //creating the chain
    player.disconnect();
    fftInput.setInput(player);

    lowpassFilter.disconnect();
    lowpassFilter.process(player, cutoffFreq.value(), resonance.value());

    waveshaperDistortion.disconnect();
    waveshaperDistortion.process(lowpassFilter, distortionAmount.value(), oversampleDict[oversample.value()]);

    delayFilter.disconnect();
    delayFilter.process(waveshaperDistortion, delayTime.value(), feedback.value());

    dynamicCompressor.disconnect();
    dynamicCompressor.process(delayFilter, attack.value(), knee.value(), ratio.value(), threshold.value(), release.value());

    reverbFilter.disconnect();
    reverbFilter.process(dynamicCompressor, reverbDuration.value(), decayRate.value(), reversed);

    masterVolume.disconnect();
    masterVolume.setInput(reverbFilter);

    fftOutput.setInput(masterVolume);
    masterVolume.connect();

}

// setup recorder
function recorderSetup()
{
    recorder = new p5.SoundRecorder();
    recorder.setInput(masterVolume);
    recording = false;
}

function draw()
{
    filterEffects();
    spectrumRefresh();
}

//change the values based on the slider values
function filterEffects()
{
    //low-pass filter
    if(filterSelect.value() == 'low-pass filter')
    {
        lowpassFilter.setType("lowpass");
        lowpassFilter.set(cutoffFreq.value(), resonance.value());
        lowpassFilter.drywet(lp_dryWet.value());
        lowpassFilter.amp(lp_outputLevel.value());
    }

    // high pass filter
    if(filterSelect.value() == 'high-pass filter')
    {
        lowpassFilter.setType("highpass");
        lowpassFilter.set(cutoffFreq.value(), resonance.value());
        lowpassFilter.drywet(lp_dryWet.value());
        lowpassFilter.amp(lp_outputLevel.value());
    }

    if(filterSelect.value() == 'band-pass filter')
    {
        lowpassFilter.setType("bandpass");
        lowpassFilter.set(cutoffFreq.value(), resonance.value());
        lowpassFilter.drywet(lp_dryWet.value());
        lowpassFilter.amp(lp_outputLevel.value());
    }

    //waveshaper distortion
    waveshaperDistortion.set(distortionAmount.value(), oversampleDict[oversample.value()]);
    waveshaperDistortion.drywet(wd_dryWet.value());
    waveshaperDistortion.amp(wd_outputLevel.value());

    //delay
    delayFilter.drywet(d_dryWet.value());
    delayFilter.amp(d_outputLevel.value());

    //dynamic compressor
    dynamicCompressor.set(attack.value(), knee.value(), ratio.value(), threshold.value(), release.value());
    dynamicCompressor.drywet(dc_dryWet.value());
    dynamicCompressor.amp(dc_outputLevel.value());

    //reverb
    reverbFilter.set(reverbDuration.value(), decayRate.value(), reversed);
    reverbFilter.drywet(r_dryWet.value());
    reverbFilter.amp(r_outputLevel.value());

    //master volume
    masterVolume.amp(masterVolume_slider.value());
}

function spectrumRefresh()
{
    var spectrumInput = fftInput.analyze();
    push();
    translate(1100, 410);
    fill(20);
    noStroke();
    rect(0, 0, 350, 150);
    fill(255, 0, 0);
    for(var i = 0; i < spectrumInput.length; i++)
    {
        var x = map(i, 0, spectrumInput.length, 0, 350);
        var y = map(spectrumInput[i], 0, 255, 0, 150);
        rect(x, 150 - y, 400 / spectrumInput.length, y);
    }
    pop();

    var spectrumOutput = fftOutput.analyze();
    push();
    translate(1100, 590);
    fill(20);
    noStroke();
    rect(0, 0, 350, 150);
    fill(0, 0, 255);
    for(var j = 0; j < spectrumOutput.length; j++)
    {
        var x2 = map(j, 0, spectrumOutput.length, 0, 350);
        var y2 = map(spectrumOutput[j], 0, 255, 0, 150);
        rect(x2, 150 - y2, 400 / spectrumOutput.length, y2);
    }
    pop();
}