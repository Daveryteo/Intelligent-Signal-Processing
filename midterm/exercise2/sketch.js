var mySound;

//meyda
var analyzer;

//controls
var playButton;
var isPlaying;

//size control
var newRMS;
var maxRMS;
var newZCR;

var SCMax;
var newSC;

var newSFlat;

var newSK;
var SKmin;
var SKmax;

var chroma;
var chromaMax;

//speech
var speech;
var backgroundColor;
var shape

function preload()
{
    soundFormats("mp3", "wav");
    mySound = loadSound("sounds/Kalte_Ohren_(_Remix_).mp3")
}

function setup()
{
    createCanvas(2000, 1000);
    maxRMS = 0;
    SCMax = 0;
    newRMS = 0;
    newSC = 0;
    newSFlat = 0;
    SKmin = 0;
    SKmax = 0;
    shape = "";
    backgroundColor = color(180, 180, 180);
    background(backgroundColor);
    meydaSetup();
    GUIsetup();
    speechSetup();
}

//create meyda analyzer
function meydaSetup()
{
    analyzer = new Meyda.createMeydaAnalyzer(
        {
            audioContext: getAudioContext(),
            source: mySound,
            bufferSize: 512,
            featureExtractors: ["rms", "zcr", "spectralCentroid", "spectralFlatness", "spectralKurtosis", "chroma"],
            callback: meydaCallback,
        }
    );
}

//create play and stop button
function GUIsetup()
{
    isPlaying = false;
    playButton = createButton('play');
    playButton.position(10, 10);
    playButton.mousePressed(() =>
    {
        if(isPlaying == true)
        {
            analyzer.stop();
            mySound.stop();
            playButton.style("background-color", "white");
            playButton.html("play");
            isPlaying = false;
        }
        else
        {
            analyzer.start();
            mySound.loop();
            playButton.style("background-color", "red");
            playButton.html("stop");
            isPlaying = true;
        }
    });
}

function speechSetup()
{
    speech = new p5.SpeechRec();
    speech.onResult = speechParser;
    speech.continuous = true;
    speech.interimResults = true;
    speech.start();
}

function speechParser()
{
    var mostRecentWord = speech.resultString.split(' ').pop();
    if(mostRecentWord.toLowerCase().indexOf("black") !== -1)
    {
        backgroundColor = color(0, 0, 0);
    }
    else if(mostRecentWord.toLowerCase().indexOf("white") !== -1)
    {
        backgroundColor = color(255, 255, 255);
    }
    else if(mostRecentWord.toLowerCase().indexOf("red") !== -1)
    {
        backgroundColor = color(200, 0, 0);
    }
    else if(mostRecentWord.toLowerCase().indexOf("blue") !== -1)
    {
        backgroundColor = color(0, 0, 200);
    }
    else if(mostRecentWord.toLowerCase().indexOf("green") !== -1)
    {
        backgroundColor = color(0, 200, 0);
    }
    else if(mostRecentWord.toLowerCase().indexOf("gray") !== -1)
    {
        backgroundColor = color(180, 180, 180);
    }
    else if(mostRecentWord.toLowerCase().indexOf("square") !== -1)
    {
        shape = "square"
    }
    else if(mostRecentWord.toLowerCase().indexOf("triangle") !== -1)
    {
        shape = "triangle"
    }
    else if(mostRecentWord.toLowerCase().indexOf("circle") !== -1)
    {
        shape = "circle"
    }
    else if(mostRecentWord.toLowerCase().indexOf("pentagon") !== -1)
    {
        shape = "pentagon"
    }
}

function draw()
{
    background(backgroundColor);

    //ensure only drawing when analyzed
    if(newRMS)
    {
        drawRMSZCR(newRMS, newZCR);
    }

    if(newSC)
    {
        drawSpectralCentroid(newSC);
    }

    if(newSFlat)
    {
        drawSFlat(newSFlat, newSK);
    }

    if(chroma)
    {
        drawChroma(chroma);
    }
}

//handle callbacks
function meydaCallback(features)
{
    //rms
    newRMS = features.rms;
    if(maxRMS < newRMS)
    {
        maxRMS = newRMS;
    }

    //zcr
    newZCR = features.zcr;

    //spectral centroid
    newSC = features.spectralCentroid;
    if(SCMax < newSC)
    {
        SCMax = newSC;
    }

    //spectral flatness
    newSFlat = features.spectralFlatness;

    //spectral kurtosis
    newSK = features.spectralKurtosis;
    if(SKmin > newSK)
    {
        SKmin = newSK;
    }
    if(SKmax < newSK)
    {
        SKmax = newSK;
    }

    chroma = features.chroma;
}

function drawRMSZCR(rms, zcr)
{
    fill(0, 125, zcr * 2, 125);
    var size = map(rms, 0, maxRMS, 100, 300);
    if(shape == "square" || shape == "triangle" || shape == "circle" || shape == "pentagon")
    {
        drawShapes(800, 200, size, size, 1);
    }
    else
    {
        noStroke();
        ellipseMode(CENTER);
        ellipse(800, 200, size);
    }
}

function drawSpectralCentroid(spc)
{
    var alpha = map(spc, 0, SCMax, 50, 255);
    noStroke();
    fill(224, 31, 174, alpha);
    if(shape == "square" || shape == "triangle" || shape == "circle" || shape == "pentagon")
    {
        drawShapes(100, 100, 150, 150, 1);
    }
    else
    {
        rect(100, 100, 150, 150);
    }
}

function drawSFlat(sflat, sk)
{
    var h = map(sflat, 0, 1, 0.2, 1)
    var w = map(sk, SKmin, SKmax, 0, 1);
    fill(0);
    noStroke();
    if(shape == "square" || shape == "triangle" || shape == "circle" || shape == "pentagon")
    {
        drawShapes(100, 500, 300*w, 300*h, 1);
    }
    else
    {
        rect(100, 500, 300 * w, 300 * h);
    }
}

function drawChroma(ch)
{
    var max = 0;
    for (var i = 0; i < 12; i++)
    {
        if (max < ch[i])
        {
            max = ch[i];
            chromaMax = i;
        }
    }

    fill(100, 100, 255);
    noStroke();
    if (shape == "square" || shape == "triangle" || shape == "circle" || shape == "pentagon")
    {
        drawShapes(600, 700, 50, 50, chromaMax);
    }
    else
    {
        for (var j = 0; j < chromaMax; j++)
        {
            rect(600 + 80 * j, 700, 50, 50);
        }
    }

}

function drawShapes(x, y, w, h, n)
{
    if (shape == "square")
    {
        for (var i = 0; i < n; i++)
        {
            rect(x + 80 * i, y, w, h);
        }
    }
    if (shape == "triangle")
    {
        for (var i = 0; i < n; i++)
        {
            triangle(x + 80 * i, y + h/2, x + w/2 + 80 * i, y, x + w + 80 * i, y + h/2);
        }
    }
    if (shape == "circle")
    {
        ellipseMode(CENTER)
        for (var i = 0; i < n; i++)
        {
            ellipse(x + w/2 + 80 * i, y + h/2, w, h)
        }
    }
    if (shape == "pentagon")
    {
        for (var i = 0; i < n; i++)
        {
            pentagon(x + w/2 + 100 * i, y + h/2, w, h)
        }
    }
}

function pentagon(x, y, w, h)
{
    var angle = TWO_PI / 5;
    beginShape();
    for(var i = 0; i < TWO_PI; i += angle)
    {
        var sx = x + cos(i) * w;
        var sy = y + sin(i) * h;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}
