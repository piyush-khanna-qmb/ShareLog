require('dotenv').config();
const ejs = require("ejs")
const express = require('express');
const body_parser = require('body-parser');
const session = require("express-session");
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const { use } = require('passport');
const mongoose = require('mongoose');
const request = require('request');
const { MongoClient, Binary, ObjectId } = require('mongodb');
// const { list } = require('parser');
const { Strategy } = require('passport-google-oauth20');
const app = express();
const port = 3000;

app.use(body_parser.json({ limit: '50mb' }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(body_parser.urlencoded({ extended: true}));
app.use(express.static(__dirname + '/views/public'));

app.use(session({
    secret : "Mera nikka jeya secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose
.connect(process.env.DATABASE)
.then(() => {
    console.log("Database Connected");
});

const chartSchema= new mongoose.Schema({
    open: [Number],
    high: [Number],
    low: [Number],
    close: [Number],
    time: [Number]
});

const audioSchema= new mongoose.Schema({
    audId: String,
    audio: {
        data: Buffer, 
        contentType: String 
    }
})

const posSchema = new mongoose.Schema({
    securityId: String,
    tradingSymbol: String,
    audioObject: audioSchema,
    text: String,
    posType: String,
    segmentType: String,
    costPrice: Number,
    buyQty: Number,
    profit: Number,
    brokerage: Number,
    drvExpiryDate: String,
    chart: chartSchema,
    dateOfBuy: String,
    dayOfBuy: String,
    strategyUsed: String
})

const holdSchema= new mongoose.Schema({
    securityId: String,
    tradingSymbol: String,
    audioObject: String,
    text: String,
    ISIN: String,
    buyQty: String,
    inDepos: String,
    availabelQty: Number,
    avgCostPrice: Number
})

const calSchema = new mongoose.Schema({
    securityIds: [String],
    date: String,
    equity: Number,
    fAndO: Number,
    commodity: Number,
    currency: Number,
    balance: Number
})

const userSchema = new mongoose.Schema({
    google_client_id:  { type: String, unique: true, required: true },
    name: String,
    email: String,
    contact: Number,
    profile_pic: String,
    theme: String,
    dhan_key: String,
    // zerodha_key: String,
    razorpay_id: String,
    period: String,
    start_day: String,
    Total_Positions: Number,
    Total_Holdings: Number,
    Total_Equities: Number,
    Total_FAndO: Number,
    Total_Currencies: Number,
    Total_Commodities: Number,
    Total_Trades: Number,
    Total_Brokerage: Number, //- from unrealized profit
    Biggest_Profit: Number,
    Biggest_Loss: Number,
    Best_Day_For_Trade: String,
    Best_Strategy: String,
    Best_Lot_Size: Number,
    Strategies: [[String]],
    curBalance: Number,
    Positions: [posSchema], 
    Holdings: [holdSchema],
    Calendar: [calSchema],
    NetPnL: Number
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate)

const User = new mongoose.model("User", userSchema);
const Position = new mongoose.model('Position', posSchema);
const Calendar = new mongoose.model('Calender', calSchema);
const Audio = mongoose.model('Audio', audioSchema);

async function findUserByGoogleClientId(googleClientId) {
    try {
      const user = await User.findOne({ google_client_id: googleClientId });
      return user;
    } catch (error) {
      console.error('Error finding user by Google Client ID:', error);
      throw error;
    }
  }

async function createUser(data) {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // January is 0!
    const year = today.getFullYear();
    const formattedToday = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

    try {
        const newUser = new User({
            google_client_id: data.google_client_id,
            name: data.name,
            email: data.email,
            contact: "",
            profile_pic: data.profile_pic,
            theme: "dark",
            dhan_key: "",
            // zerodha_key: "",
            razorpay_id: "",
            period: "trial",
            start_day: formattedToday,
            Total_Positions: 0,
            Total_Holdings: 0,
            Total_Equities: 0,
            Total_FAndO: 0,
            Total_Currencies: 0,
            Total_Commodities: 0,
            Total_Trades: 0,
            Total_Brokerage: 0, //- from unrealized profit
            Biggest_Profit: 0,
            Biggest_Loss: 0,
            Best_Day_For_Trade: "",
            Best_Strategy: "",
            Best_Lot_Size: 0,
            Strategies: [],
            curBalance: 0,
            Positions: [], 
            Holdings: [],
            Calendar: [],
            NetPnL: 0
        });

        const savedUser = await newUser.save();
        return savedUser;
    } catch (error) {
        console.error('Error creating user:', error);
        return "";
    }
}

// passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(id, done) {
    done(null, id);
});

passport.use("google", new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/ShareLog",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
    // res.redirect("/Dashboard")
    try {
        findUserByGoogleClientId(profile.id)
        .then(user => {
            if (user) {
            console.log('Found user:', user);
            cb(null, user)
            } else {
            console.log('User not found.');
            
            var data= {
                google_client_id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profile_pic: profile.photos[0].value,
            }

            createUser(data)
            .then(newUser => {
                console.log('New user created:', newUser);
                cb(null, newUser);
            })
            .catch(error => {
                console.error('Error:', error);
            });
                
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    catch {
        console.log("Lulla")
    }
  }
));


app.get('/auth/google',
  passport.authenticate("google", 
  { scope: ['profile', 'email'] }
  ));

app.get('/auth/google/ShareLog', 
  passport.authenticate('google', { 
    successRedirect: "/HandleNew",
    failureRedirect: '/Signin' }),
  function(req, res) {
    // Successful authentication, redirect home.
    const googleClientId = req.user.googleClientId; // Assuming req.user contains user data from authentication
    req.session.googleClientId = googleClientId;
    res.redirect('/Dashboard');
  }
);

app.get("/HandleNew", function (req, res) {
    if(String(req.session.passport.user.dhan_key).length === 0) {
        // User with no zerodha key. Should redirect to Welcome page
        res.redirect("/Welcome");
    }
    else{
        // Redirect to Dashboard directly
        res.redirect("/Dashboard")
    }
})

app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
})

app.get("/", function(req, res) {
    console.log(req.user);
    if(req.isAuthenticated()) {
        console.log("Apna hi launda hai.")
        res.redirect("/Dashboard")
    } else {
        console.log("Jabardasti ki entry");
        res.redirect("/Home")
    }
})

app.post("/razorpayCallback", async function (req, res) {
    console.log(req.body.razorpay_payment_id);
    try {
        const doc = await User.findOne({ google_client_id: req.session.passport.user.google_client_id });

        if (doc) {
            doc.razorpay_id= req.body.razorpay_payment_id;
            doc.period= "permanent";
            await doc.save(); // Save the changes
            console.log("Successfully updated 'razorpay id'");
        } else {
            console.log("Document with google_id not found.");
        }
    } catch (error) {
        console.error("Error updating 'zerodha_id':", error);
    }
    res.redirect("/Dashboard")
})

function getDateObjectFromString(dateString) {
    // Split the date string into day, month, and year
    const [day, month, year] = dateString.split('-').map(Number);

    // Create a new Date object with the given day, month, and year
    return new Date(year, month - 1, day);
}

const dbName = 'Recordings';

app.post('/saveAudio', async (req, res) => {
    
    try {
        const { buttonId, audio } = req.body;

        // Convert base64 audio data to Buffer
        const audioBuffer = Buffer.from(audio, 'base64');

        // Create a new audio document
        const newAudio = new Audio({
            audId: buttonId,
            audio: {
                data: audioBuffer,
                contentType: 'audio/wav' // Example content type (adjust as needed)
            }
        });
        
        const googleClientId= req.session.passport.user.google_client_id;
        const user = await User.findOne({ google_client_id: googleClientId });
        
        const index = user.Positions.findIndex(position => position._id == buttonId);

        if (index !== -1) {
            console.log('Index of position with key position ID:', index);

            await newAudio.save()
            .then(savedAudio => {
                console.log('Recording saved to MongoDB:', savedAudio);
            })
            .catch(error => {
                console.error('Error saving recording to MongoDB:', error);
            });

            user.Positions[index].audioObject = newAudio;
            await user.save();

        } else {
            console.log('No position found with key position ID:', buttonId);
        }
        
        res.status(201).send('Audio data has been successfully stored.').end();

    }
    catch (error) {
        console.error('Error saving recording to MongoDB:', error);
        res.status(500).json({ error: 'Internal server error' });
    }    

  });

  app.post('/playAudio', async (req, res) => {

    try {
        const buttId= req.body.buttonId;
        console.log("Request to look for button ID", buttId);
        const googleClientId= req.session.passport.user.google_client_id;
        const user = await User.findOne({ google_client_id: googleClientId });
        const index = user.Positions.findIndex(position => position._id == buttId);
        if (index !== -1) {
            console.log('Name of position with key position ID:', user.Positions[index].tradingSymbol);
            console.log("Found an audio object corresponding: ", user.Positions[index].audioObject);
            const audioData= user.Positions[index].audioObject;
            res.status(200).send(audioData.audio.data);
        } else {
            console.log('No position found with key position ID:', buttonId);
            res.status(404).send('No audio data found');
        }
    }
    catch (error){
        console.error('Error playing audio:', error);
        res.status(500).send('Error playing audio');
    }
    
  });

function getDateForDashboard(data) {
    const date = new Date(data);

    // Get day, month, and year
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    // Array of month names
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Format the day with suffix (e.g., 1st, 2nd, 3rd)
    let dayFormatted;
    switch (day) {
        case 1:
        case 21:
        case 31:
            dayFormatted = day + "st";
            break;
        case 2:
        case 22:
            dayFormatted = day + "nd";
            break;
        case 3:
        case 23:
            dayFormatted = day + "rd";
            break;
        default:
            dayFormatted = day + "th";
    }

    // Format the date as "ddth mmm, yyyy"
    const formattedDate = `${dayFormatted} ${months[monthIndex]}, ${year}`;

    return formattedDate;
}

app.get("/Dashboard", async (req, res)=>{

    if(req.isAuthenticated()) {

        const googleClientId= req.session.passport.user.google_client_id;
        const user = await User.findOne({ google_client_id: googleClientId });

        let allPositions = await generateFakePosition();
        // let allPositions = await getAllPositions();
        console.log(allPositions);

        //! Extract and add all positions
        for (const thisPosition of allPositions) 
        {
            let positionExists = false;
            for (const position of user.Positions) 
            {
                if (position.securityId === thisPosition.securityId) {
                    positionExists = true;
                    console.log("Position already exists in DB. Skipping");
                    break;
                }
            }
            if(!positionExists) 
            {
                console.log("New position. Storing it to DB");
                console.log("Retrieving chart for this position from Dhan");

                var chartData;
                try {
                    chartData= await getChartData(thisPosition.securityId , "NSE_FNO", "OPTIDX");
                }
                catch(err) {
                    chartData= null;
                }

                user.Total_Positions++;
                user.Total_Trades++;

                console.log(typeof(chartData));
                console.log(chartData);
                if(String(chartData.errorCode).toLowerCase() === "none") {
                    console.log("Chart lost as application not opened");
                    chartData = null;
                } else {
                    console.log("Some other bullshit with chart. Maybe chart rendered");
                    console.log(String(chartData.errorCode));
                    if(String(chartData.open) !== "undefined" && chartData.open.length > 0) {
                        console.log("Chart data avaialable!");
                    } else {
                        chartData = null;
                    }
                }

                //! Make amendments for biggest loss, profit etc
                user.Total_Brokerage+= thisPosition.unrealizedProfit;

                if(thisPosition.realizedProfit > user.Biggest_Profit) {
                    user.Biggest_Profit = thisPosition.realizedProfit;
                    user.Best_Day_For_Trade= getLocalDayName();
                    user.Best_Lot_Size= thisPosition.buyQty;
                }

                if(thisPosition.realizedProfit < user.Biggest_Loss)
                    user.Biggest_Loss = thisPosition.realizedProfit;

                user.NetPnL += (thisPosition.realizedProfit - thisPosition.unrealizedProfit);


                //! Save pos object
                const positionData = {
                    securityId: thisPosition.securityId,
                    tradingSymbol: thisPosition.tradingSymbol,
                    audioObject: null,
                    text: "",
                    posType: thisPosition.positionType,
                    segmentType: thisPosition.exchangeSegment,
                    costPrice: thisPosition.costPrice,
                    buyQty: thisPosition.buyQty,
                    profit: thisPosition.realizedProfit,
                    brokerage: thisPosition.unrealizedProfit,
                    drvExpiryDate: thisPosition.drvExpiryDate,
                    chart: chartData,
                    dateOfBuy: getLocalDate(),
                    dayOfBuy: getLocalDayName(),
                    strategyUsed: ""
                };

                var newPosition = new Position(positionData);
                user.Positions.push(newPosition);
                await user.save();
                console.log("Chart saved");
            }
        }

        //! Calendar Work
        for (const thisPosition of allPositions)
        {
            let posType;
            if(String(thisPosition.exchangeSegment).toLowerCase().includes("fno"))
                posType= "fno";
            else if(String(thisPosition.exchangeSegment).toLowerCase().includes("eq"))
                posType= "eq";
            else if(String(thisPosition.exchangeSegment).toLowerCase().includes("comm"))
                posType= "comm";
            else if(String(thisPosition.exchangeSegment).toLowerCase().includes("curr"))
                posType= "curr";
            
            const secId= thisPosition.securityId;

            const aajKiDateWalaObject= await findCalendarEntryForToday(user);
            console.log(aajKiDateWalaObject);
            if(typeof aajKiDateWalaObject === "string")
            {
                console.log("Calendar object not found. Banana padega");
                
                //! Get Balance
                const curBal= await getCurBalance();

                //! make Calendar object 
                let fno= 0, eq= 0, comm= 0, curr= 0;
                if (posType === "fno") {
                    fno++;
                    user.Total_FAndO++;
                }
                else if (posType === "eq"){
                    eq++;
                    user.Total_Equities++;
                }
                else if (posType === "comm"){
                    comm++;
                    user.Total_Commodities++;
                }
                else if (posType === "curr"){
                    curr++;
                    user.Total_Currencies++;
                }

                const calendar = new Calendar({
                    securityIds: [secId],
                    date: getLocalDate(),
                    equity: eq,
                    fAndO: fno,
                    commodity: comm,
                    currency: curr,
                    balance: curBal
                });

                //! Save in user
                await calendar.save();
                await user.Calendar.push(calendar);
                await user.save();
            }
            else
            {
                console.log("Ek calendar mila hai");

                if(!aajKiDateWalaObject.securityIds.includes(secId))
                {
                    if (posType === "fno"){
                        aajKiDateWalaObject.fAndO++;
                        user.Total_FAndO++;
                    }
                    else if (posType === "eq"){
                        aajKiDateWalaObject.equity++;
                        user.Total_Equities++;
                    }
                    else if (posType === "comm"){
                        aajKiDateWalaObject.commodity++;
                        user.Total_Commodities++;
                    }
                    else if (posType === "curr"){
                        aajKiDateWalaObject.currency++;
                        user.Total_Currencies++;
                    }
                    
                    aajKiDateWalaObject.securityIds.push(secId);
                    aajKiDateWalaObject.save({ suppressWarning: true });
                    user.save();
                }
            }
        }

        var themeThis= user.theme;
        res.render("Dashboard.ejs", {
            theme: themeThis,
            imgSrc: req.session.passport.user.profile_pic,
            PageTitle: "Dashboard",
            Name: req.session.passport.user.name.split(" ")[0],
            // DateBought: formattedDate,
            // DayBought: dayNames[dayy],
            TypePosOrHold: "P&L",
            PAndL: Number(user.NetPnL).toFixed(2),
            TotStrats: user.Strategies.length,
            TotPos: user.Total_Positions,
            TotHolds: user.Total_Holdings,
            Amount: Number(user.NetPnL).toFixed(2),
            carouselData: user.Positions
        });

    } else {
        console.log("Jabardasti ki entry");
        res.redirect("/Home")
    }
})

function convertDateFormat(date) {
    const parts = date.split('-');
    // Rearrange the parts to the desired format (MM-DD-YYYY)
    return `${parts[1]}-${parts[2]}-${parts[0]}`;
}

app.get("/Portfolio", async (req, res)=>{

    if(req.isAuthenticated()) {
        const googleClientId= req.session.passport.user.google_client_id;
        const user = await User.findOne({ google_client_id: googleClientId });
        var themeThis= user.theme;
        var randStrat= "None";
        if(user.Strategies.length > 0) {
            const randomIndex = Math.floor(Math.random() * user.Strategies.length);
            randStrat= user.Strategies[randomIndex][0];
        }

        const filteredCal = filterDateAndBalance(user.Calendar);
        filteredCal.forEach(obj => {
            obj.date = convertDateFormat(obj.date);
        });
        const jabdaDabda= filteredCal;
        console.log(typeof(filteredCal));
        console.log(filteredCal);

        res.render("Portfolio.ejs", 
        {
            theme: themeThis,
            imgSrc: req.session.passport.user.profile_pic,
            PageTitle: "Portfolio",
            Name: req.session.passport.user.name.split(" ")[0],
            PAndL: Number(user.NetPnL).toFixed(2),
            splineData: jabdaDabda,
            BestStrat: randStrat,
            NumTrads: user.Total_Trades,
            equity: user.Total_Equities,
            commodity: user.Total_Commodities,
            currency: user.Total_Currencies,
            fno: user.Total_FAndO,
            TotBrokerage: Number(user.Total_Brokerage).toFixed(2),
        });
    } else {
        res.redirect("/Home")
    }
})


function getLocalDayName() {
    const currentDate = new Date();
    
    // Options for formatting the date
    const options = { weekday: 'long' };
    
    // Get the local day name using toLocaleDateString
    return currentDate.toLocaleDateString('en-US', options);
}

function getLocalDate() {
    const currentDate = new Date();
    
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero based
    const year = currentDate.getFullYear();

    return `${year}-${month}-${day}`;
}

function getAllPositions() {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            url: 'https://api.dhan.co/positions',
            headers: {
                'access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzEzODc0NTY2LCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiIiwiZGhhbkNsaWVudElkIjoiMTEwMDY4NzY5NyJ9.d2Bu7gDAE5u7WPT-VQ4LAq-stLgSNKHOB92aXSFZNCUQkRa9x5sB5c9XA6rHXzUTYstm-qENS5ijVUIMH1et1g',
                Accept: 'application/json'
            }
        };

        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}

async function generateFakePosition() {
    const positionData = [
        {
          "dhanClientId": "string",
          "tradingSymbol": "NayaBsdka",
          "securityId": "1",
          "positionType": "LONG",
          "exchangeSegment": "NSE_EQ",
          "productType": "CNC",
          "buyAvg": 0,
          "costPrice": 0,
          "buyQty": 0,
          "sellAvg": 0,
          "sellQty": 0,
          "netQty": 0,
          "realizedProfit": 123,
          "unrealizedProfit": 2,
          "rbiReferenceRate": 0,
          "multiplier": 0,
          "carryForwardBuyQty": 0,
          "carryForwardSellQty": 0,
          "carryForwardBuyValue": 0,
          "carryForwardSellValue": 0,
          "dayBuyQty": 0,
          "daySellQty": 0,
          "dayBuyValue": 0,
          "daySellValue": 0,
          "drvExpiryDate": "string",
          "drvOptionType": "CALL",
          "drvStrikePrice": 0,
          "crossCurrency": true
        },
        {
            "dhanClientId": "string",
            "tradingSymbol": "DoosraBsdka",
            "securityId": "12",
            "positionType": "LONG",
            "exchangeSegment": "NSE_EQ",
            "productType": "CNC",
            "buyAvg": 0,
            "costPrice": 0,
            "buyQty": 0,
            "sellAvg": 0,
            "sellQty": 0,
            "netQty": 0,
            "realizedProfit": -12,
            "unrealizedProfit": 0,
            "rbiReferenceRate": 0,
            "multiplier": 0,
            "carryForwardBuyQty": 0,
            "carryForwardSellQty": 0,
            "carryForwardBuyValue": 0,
            "carryForwardSellValue": 0,
            "dayBuyQty": 0,
            "daySellQty": 0,
            "dayBuyValue": 0,
            "daySellValue": 0,
            "drvExpiryDate": "string",
            "drvOptionType": "CALL",
            "drvStrikePrice": 0,
            "crossCurrency": true
          },
          {
            "dhanClientId": "string",
            "tradingSymbol": "TeesraBsdka",
            "securityId": "123",
            "positionType": "LONG",
            "exchangeSegment": "NSE_FNO",
            "productType": "CNC",
            "buyAvg": 0,
            "costPrice": 0,
            "buyQty": 0,
            "sellAvg": 0,
            "sellQty": 0,
            "netQty": 0,
            "realizedProfit": 69,
            "unrealizedProfit": 0,
            "rbiReferenceRate": 0,
            "multiplier": 0,
            "carryForwardBuyQty": 0,
            "carryForwardSellQty": 0,
            "carryForwardBuyValue": 0,
            "carryForwardSellValue": 0,
            "dayBuyQty": 0,
            "daySellQty": 0,
            "dayBuyValue": 0,
            "daySellValue": 0,
            "drvExpiryDate": "string",
            "drvOptionType": "CALL",
            "drvStrikePrice": 0,
            "crossCurrency": true
          }
      ]

    return JSON.parse(JSON.stringify(positionData));
}

async function getChartData(securityID, exchangeSeg, instru) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: 'https://api.dhan.co/charts/intraday',
            headers: {
                'access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzEzODc0NTY2LCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiIiwiZGhhbkNsaWVudElkIjoiMTEwMDY4NzY5NyJ9.d2Bu7gDAE5u7WPT-VQ4LAq-stLgSNKHOB92aXSFZNCUQkRa9x5sB5c9XA6rHXzUTYstm-qENS5ijVUIMH1et1g',
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: { securityId: securityID, exchangeSegment: exchangeSeg, instrument: instru },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

async function findCalendarEntryForToday(user) {
    const today = getLocalDate() 
    try {
        const calendarEntry = user.Calendar.find(entry => entry.date === today);
        return calendarEntry || "none";
    } catch (error) {
        console.error("Error finding calendar entry:", error);
        return "error";
    }
}

async function getCurBalance() {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url: 'https://api.dhan.co/fundlimit',
        headers: {
          'access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzEzODc0NTY2LCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiIiwiZGhhbkNsaWVudElkIjoiMTEwMDY4NzY5NyJ9.d2Bu7gDAE5u7WPT-VQ4LAq-stLgSNKHOB92aXSFZNCUQkRa9x5sB5c9XA6rHXzUTYstm-qENS5ijVUIMH1et1g',
          Accept: 'application/json'
        }
      };
  
      request(options, function (error, response, body) {
        if (error) reject(error);
        else resolve(JSON.parse(body).availabelBalance);
      });
    });
  }

function getTodaysPositions(user) {
    try {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        // Filter positions based on dateOfBuy
        const todaysPositions = user.Positions.filter(position => position.dateOfBuy === formattedDate);
        return todaysPositions;
    } catch (error) {
        console.error('Error retrieving today\'s positions:', error);
        throw error;
    }
}

app.get("/Positions", async(req, res)=>
{ 
    if(req.isAuthenticated()) {
        //! Check for new Positions bought, add them to DB. 
        //! Check if it is equity/future etc and add to total number
        //! Add to calendar equity/futures for the day
        //! Add in total brokerage
        //! If max profit, update also best day for trading, best strategy, best Lot Size
        //! Check if max loss

        const googleClientId= req.session.passport.user.google_client_id;
        const user = await User.findOne({ google_client_id: googleClientId });
        // let allPositions = await getAllPositions();
        let todaysPositions = getTodaysPositions(user)
        
        var hasRecording = new Boolean(0);
        res.render("Positions.ejs", 
        {
            theme: user.theme,
            imgSrc: user.profile_pic,
            PageTitle: "Positions",
            Name: user.name.split(" ")[0],
            isavailable: hasRecording,
            carouselData: todaysPositions,
            Strategies: user.Strategies
        });

    } else {
        res.redirect("/Home")
    }    
})

app.get("/Holdings", (req, res)=>{
    
    if(req.isAuthenticated()) {
        var items= []
    
        const options = {
            method: 'GET',
            url: 'https://api.dhan.co/holdings',
            headers: {'access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzEzODc0NTY2LCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiIiwiZGhhbkNsaWVudElkIjoiMTEwMDY4NzY5NyJ9.d2Bu7gDAE5u7WPT-VQ4LAq-stLgSNKHOB92aXSFZNCUQkRa9x5sB5c9XA6rHXzUTYstm-qENS5ijVUIMH1et1g', Accept: 'application/json'}
        };

        
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(JSON.parse(body));
            if(JSON.parse(body).httpStatus ==  "BAD_REQUEST")
            {
                items= []
            }
            else
                items= items.concat(JSON.parse(body));
            // items.push({
            //     "dhanClientId": "12456466",
            //     "tradingSymbol": "TVS ke stocks",
            //     "securityId": "567132",
            //     "positionType": "LONG",
            //     "exchangeSegment": "NSE_EQ",
            //     "productType": "CNC",
            //     "buyAvg": 0,
            //     "costPrice": 0,
            //     "buyQty": 0,
            //     "sellAvg": 0,
            //     "sellQty": 0,
            //     "netQty": 0,
            //     "realizedProfit": 0,
            //     "unrealizedProfit": 0,
            //     "rbiReferenceRate": 0,
            //     "multiplier": 0,
            //     "carryForwardBuyQty": 0,
            //     "carryForwardSellQty": 0,
            //     "carryForwardBuyValue": 0,
            //     "carryForwardSellValue": 0,
            //     "dayBuyQty": 0,
            //     "daySellQty": 0,
            //     "dayBuyValue": 0,
            //     "daySellValue": 0,
            //     "drvExpiryDate": "string",
            //     "drvOptionType": "CALL",
            //     "drvStrikePrice": 0,
            //     "crossCurrency": true
            // });

            var hasRecording = new Boolean(0);
            const googleClientId= req.session.passport.user.google_client_id;
            var themeThis= "none";
            getThemeById(googleClientId)
            .then(theme => {
                // console.log("Strategies:", strategies);
                themeThis= theme;
                // console.log("Theme this:"+ themeThis);
                res.render("Holdings.ejs", 
                {
                    theme: themeThis,
                    imgSrc: req.session.passport.user.profile_pic,
                    PageTitle: "Holdings",
                    Name: req.session.passport.user.name.split(" ")[0],
                    list: items, 
                    isavailable: hasRecording
                });
            })
            .catch(err => {
                console.error("Error:", err);
            });
            
        });

    } else {
        res.redirect("/Home")
    }    
})

function filterCalendarArray(calendarArray) {
    const filteredArray= calendarArray.map(obj => ({
        date: obj.date,
        equity: obj.equity,
        fAndO: obj.fAndO,
        commodity: obj.commodity,
        currency: obj.currency,
    }));

    filteredArray.unshift({ defaultValue: -9 });

    return filteredArray;
}

function filterDateAndBalance(calendarArray) {
    const filteredArray = calendarArray.map(obj => ({
        date: obj.date,
        balance: obj.balance
    }));

    return filteredArray;
}

app.get("/Overview-Report", (req, res)=>{

    if(req.isAuthenticated()) {
        const options = {
            method: 'GET',
            url: 'https://api.dhan.co/fundlimit',
            headers: {
              'access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzEzODc0NTY2LCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiIiwiZGhhbkNsaWVudElkIjoiMTEwMDY4NzY5NyJ9.d2Bu7gDAE5u7WPT-VQ4LAq-stLgSNKHOB92aXSFZNCUQkRa9x5sB5c9XA6rHXzUTYstm-qENS5ijVUIMH1et1g',
              Accept: 'application/json'
            }
          };
          
          request(options, async function (error, response, body) {
            if (error) throw new Error(error);
          
            var k= JSON.parse(body).availabelBalance;
            const googleClientId= req.session.passport.user.google_client_id;
            const user = await User.findOne({ google_client_id: googleClientId });
            var themeThis= user.theme;

            const data= user.Calendar;
            const filteredArray = filterCalendarArray(data);
            console.log(filteredArray);
            console.log(typeof(filteredArray));

            res.render("Overview-Report.ejs", 
            {
                theme: themeThis,
                imgSrc: req.session.passport.user.profile_pic,
                PageTitle: "Overview Report",
                Name: req.session.passport.user.name.split(" ")[0],
                AccBalance: k,
                CumRet: 0,
                NonCumRet: 0,
                DaiRet: 0,
                RetWin: 0,
                RetLoss: 0,
                calData: filteredArray,
                BigPro: user.Biggest_Profit,
                BigLoss: Math.abs(Number(user.Biggest_Loss))
            });
          });
    } else {
        res.redirect("/Home")
    }    
})

app.get("/Setup-Report", (req, res)=>{
    if(req.isAuthenticated()) {
        console.log("Profile me: "+ req.session.passport.user.google_client_id);
        const googleClientId= req.session.passport.user.google_client_id;
        var themeThis= "none";

        let data= [
            ["Monday", "12-04-2024", 12, 12, 12, 12, 12, 12, 12, 12],
            ["Tuesday", "13-04-2024", 12, 13, 15, 2, 12, 12, 12, 12],
            ["Wednesday", "14-04-2024",  12, 12, 52, 12, 12, 12, 12, 12],
            ["Thursday", "15-04-2024", 12, 62, 12, 12, 12, 12, 12, 12],
            ["Friday", "16-04-2024", 12, 32, 12, 12, 16, 12, 12, 12]
        ]

        getThemeById(googleClientId)
        .then(theme => {
            // console.log("Strategies:", strategies);
            themeThis= theme;
            console.log("Theme this:"+ themeThis);
            res.render("Setup-Report.ejs", 
            {
                theme: themeThis,
                imgSrc: req.session.passport.user.profile_pic,
                PageTitle: "Setup-Report",
                data: data,
                Name: req.session.passport.user.name.split(" ")[0],
                PAndL: "50,000",
                BestStrat: "Trendline",
                NumTrads: 23,
                TotBrokerage: "20,000",
            });
        })
        .catch(err => {
            console.error("Error:", err);
        });
    } else {
        res.redirect("/Home")
    }
})

app.get("/ShareLog-Analysis", async (req, res)=>{

    if(req.isAuthenticated()) {
        const googleClientId= req.session.passport.user.google_client_id;
        const user = await User.findOne({ google_client_id: googleClientId });
        var themeThis= user.theme;
        var randStrat= "None";
        if(user.Strategies.length > 0) {
            const randomIndex = Math.floor(Math.random() * user.Strategies.length);
            randStrat= user.Strategies[randomIndex][0];
        }
        var busty= "None"
        if(user.Best_Day_For_Trade.length > 0)
            busty= user.Best_Day_For_Trade;

        res.render("Sharelog-Analysis.ejs", 
        {
            theme: themeThis,
            imgSrc: req.session.passport.user.profile_pic,
            PageTitle: "Analysis",
            Name: req.session.passport.user.name.split(" ")[0],
            BestStrats: randStrat,
            BestTimeSlot: "Morning",
            BestDay: busty,
            BestLot: user.Best_Lot_Size,
            BigPro: user.Biggest_Profit,
            BigLoss: Math.abs(user.Biggest_Loss)
        });

    } else {
        res.redirect("/Home")
    }    
})

async function getStrategiesByClientId(googleClientId) {
    try {
        // Find the user with the given google_client_id
        const user = await User.findOne({ google_client_id: googleClientId });

        if (!user) {
            // console.log("User not found");
            return []; // Return an empty array if user not found
        }

        // Access the Strategies field from the user document
        const strategies = user.Strategies;

        return strategies;
    } catch (error) {
        // console.error("Error fetching strategies:", error);
        return []; // Return an empty array in case of error
    }
}

app.post("/SaveDataForPos", async function (req, res) {
    const strat= req.body.strat;
    const descr= req.body.Descr;
    const posId= req.body.posId;

    const googleClientId= req.session.passport.user.google_client_id;
    const user = await User.findOne({ google_client_id: googleClientId });

    const index = user.Positions.findIndex(position => position._id == posId);
    const thisPossy= user.Positions[index];

    thisPossy.text= descr;
    thisPossy.strategyUsed= strat;

    await user.save();
    console.log("Strategy and Notes saved");
    res.redirect("/Positions")
})

app.get("/Strategies", (req, res)=>{
    
    if(req.isAuthenticated()) {
        var items= [];
        const googleClientId= req.session.passport.user.google_client_id;
        // const googleClientId= req.session.googleClientId;
        getStrategiesByClientId(googleClientId)
        .then(strategies => {
            items= strategies;
            var themeThis= "none";
            getThemeById(googleClientId)
            .then(theme => {
                themeThis= theme;
                res.render("Strategies.ejs", 
                {
                    theme: themeThis,
                    imgSrc: req.session.passport.user.profile_pic,
                    PageTitle: "Strategies",
                    Name: req.session.passport.user.name.split(" ")[0],
                    list: items
                });
            })
            .catch(err => {
                console.error("Error:", err);
            });
        })
        .catch(err => {
            console.error("Error:", err);
        });

    } else {
        res.redirect("/Home")
    }

    
    
})
app.post("/Strategies", async (req, res) => {

    // console.log(req.body);
    newStrat= req.body.Strat;
    newDesc= req.body.Descr;

    if(newStrat.length == 0 || newStrat==null || String(newStrat).trim().length == 0)
        res.redirect("/Strategies")
    
    else {
    
        const googleClientId= req.session.passport.user.google_client_id;
        const strategyName = newStrat; 

        try {
        
            const user = await User.findOne({ google_client_id: googleClientId });
            // console.log(user);
            if (!user) {
            return res.status(404).json({ error: 'User not found' });
            }

            if(newDesc.length == 0 || newDesc==null || String(newDesc).trim().length == 0)
                newDesc= "No description provided."

            user.Strategies.push([newStrat, newDesc]);
        
            await user.save();

        } catch (error) {
            // console.error('Error adding strategy:', error);
        }
        res.redirect("/Strategies")
    }
})

app.post("/del-strategy", async function (req, res) {
    const googleClientId= req.session.passport.user.google_client_id;
    const strategyToDelete= req.body.submitStrat;
    // console.log(strategyToDelete);
    try {
        const user = await User.findOne({ google_client_id: googleClientId });
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        user.Strategies = user.Strategies.filter(strategy => {
            return strategy[0] !== strategyToDelete;
        });
    
        await user.save();
        res.redirect("Strategies")
      } 
      catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
      }
})

async function getThemeById(googleClientId) {
    try {
        const user = await User.findOne({ google_client_id: googleClientId });

        if (!user) {
            return ""; 
        }

        const theme = user.theme;

        return theme;
    } catch (error) {
        return [];
    }
}

app.get("/Profile", async (req, res)=>{
    if(req.isAuthenticated()) {
        var themeThis= "none";
        const googleClientId= req.session.passport.user.google_client_id;
        // const googleClientId= req.session.googleClientId;

        try {
            // Find the document with the given 'google_id'
            const doc = await User.findOne({ google_client_id: googleClientId });
    
            res.render("Profile.ejs", 
            {
                theme: doc.theme,
                PageTitle: "Profile",
                Name: doc.name.split(" ")[0],
                imgSrc: doc.profile_pic,
                fullName: doc.name,
                dhanClientID: doc.dhan_key,
                // HQClientID: doc.zerodha_key,
                userEmail: doc.email,
                userContact: doc.contact,
                accType: doc.period,
                endDate: "20th Sept, 2069"
            });

        } catch (error) {
            console.error("Error updating 'zerodha_id':", error);
        }

        // getThemeById(googleClientId)
        // .then(theme => {
        //     // console.log("Strategies:", strategies);
        //     themeThis= theme;
        //     console.log("Theme this:"+ themeThis);
            
        // })
        // .catch(err => {
        //     console.error("Error:", err);
        // });
    } else {
        res.redirect("/Home")
    }
});

app.post('/toggle', async function (req, res) {
    const dataReceived = req.body;
    console.log(dataReceived);
    const theme = dataReceived.theme;
    const clientId= req.session.passport.user.google_client_id;
    console.log(typeof(dataReceived.theme));
    try {
        
        const user = await User.findOne({ google_client_id: clientId });
        // console.log(user);
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        console.log("Pehle: "+user.theme);
        user.theme= dataReceived.theme;
        console.log("Baad mein: "+user.theme);
    
        await user.save();
        getThemeById(clientId)
        .then(theme => {
            // console.log("Strategies:", strategies);
            themeThis= theme;
            res.redirect("/Profile")
        })
        .catch(err => {
            console.error("Error:", err);
        });
    } catch (error) {
        console.error('Error adding strategy:', error);
    }
});

app.get("/Signup", (req, res)=>{
    res.render("SignUp.ejs");
})

app.get("/Signin", (req, res)=>{
    res.render("SignIn.ejs");
})

app.get("/Home", (req, res)=>{
    res.render("Home.ejs");
})

app.get("/Welcome", (req, res)=>{
    res.render("Welcome.ejs", 
    {
        username: req.session.passport.user.name,
        mail: req.session.passport.user.email
    });
})

app.post("/welcome", async function (req, res) {
    console.log("Change karne ki request aayi hai bhancho: ")
    console.log(req.body); 
    try {
        const doc = await User.findOne({ google_client_id: req.session.passport.user.google_client_id });

        // If document is found, update its 'zerodha_id'
        if (doc) {
            doc.dhan_key= req.body.dhanClientId;
            // doc.zerodha_key = req.body.hqClientId; 
            doc.contact = req.body.contactNumber;
            if(req.body.name.length > 0) {
                doc.name= req.body.name;
            }
            if(req.body.email.length > 0) {
                doc.email= req.body.email;
            }
            await doc.save(); // Save the changes
            console.log("Successfully uadded new user");
        } else {
            console.log("Document with google_id not found.");
        }
    } catch (error) {
        console.error("Error updating 'zerodha_id':", error);
    }
    //! If req.body.accountType == permanent => redirect to buy page, else dashboard
    if(req.body.accountType == "permanent") {
        res.redirect("/Buy")
    } else {
        res.redirect("/Dashboard")
    }
})

app.get("/Buy", function (req, res) {
    res.render("Buy.ejs")
})

app.listen(port, ()=>{
    console.log(`server running on port: ${port}`)
})