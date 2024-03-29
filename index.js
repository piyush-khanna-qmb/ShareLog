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
const { list } = require('parser');
const { Strategy } = require('passport-google-oauth20');
const app = express();
const port = 3000;

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

const userSchema = new mongoose.Schema({
    google_client_id: String,
    name: String,
    email: String,
    contact: Number,
    profile_pic: String,
    theme: String,
    dhan_key: String,
    zerodha_key: String,
    period: String,
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
    Strategies: [String],
    // Positions: , 
    // Holdings: ,
    // Calendar: 
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate)

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    })
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/ShareLog",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/tryUser", function (req, res) {
    var newUser= new User({
        google_client_id: "2vsdf12",
        name: "Piyush Khanna",
        email: "piyushb@gmail",
        contact: 8755122371,
        profile_pic: "www.google.com",
        theme: "dark",
        dhan_key: "Dhan-cdsdcsd",
        zerodha_key: "Zero-csdcsdc",
        period: "permanent",
        Total_Positions: 321,
        Total_Holdings: 3222,
        Total_Equities: 3123,
        Total_FAndO: 22,
        Total_Currencies: 1,
        Total_Commodities: 121,
        Total_Trades: 2121,
        Total_Brokerage: 121, //- from unrealized profit
        Biggest_Profit: 21111,
        Biggest_Loss: 21,
        Best_Day_For_Trade: "Monday",
        Best_Strategy: "Trendline",
        Best_Lot_Size: 123123,
        Strategies: ["Trendline", "Khanna-Strat"],
    });
    newUser.save()
    .then(function (models) {
        if(models) {
            // console.log("Added Successfully!");
            console.log("User saved");
            res.redirect("/");
        }
    })
    .catch( function (err) {
        console.log(err);
        res.send("Pehle se hi hai")
    });
})


app.get("/", (req, res)=>{
    const currentDate = new Date();
    const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sept", "Oct",
    "Nov", "Dec"
    ];
    const day = currentDate.getDate();
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const dayy= currentDate.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const formattedDate = `${day} ${monthNames[monthIndex]}, ${year}`;

    //! Get these data in real time from the API
    /* 
        formattedDate ki jagah date of buying stuff from database
        Type: Holdings hain ya Position
    */

        const googleClientId= "2vsdf12";
        var themeThis= "none";
        getThemeById(googleClientId)
        .then(theme => {
            // console.log("Strategies:", strategies);
            themeThis= theme;
            console.log("Theme this:"+ themeThis);
            res.render("Dashboard.ejs", {
                theme: themeThis,
                PageTitle: "Dashboard",
                Name: "Piyush",
                DateBought: formattedDate,
                DayBought: dayNames[dayy],
                TypePosOrHold: "P&L",
                PAndL: "+2500.00",
                TotStrats: 5,
                TotPos: 7,
                TotHolds: 59,
                Amount: "+2980.50"
            });
        })
        .catch(err => {
            console.error("Error:", err);
        });    
})

app.get("/Portfolio", (req, res)=>{
    const googleClientId= "2vsdf12";
    var themeThis= "none";
    getThemeById(googleClientId)
    .then(theme => {
        // console.log("Strategies:", strategies);
        themeThis= theme;
        console.log("Theme this:"+ themeThis);
        res.render("Portfolio.ejs", 
        {
            theme: themeThis,
            PageTitle: "Portfolio",
            Name: "Piyush",
            PAndL: "50,000",
            BestStrat: "Trendline",
            NumTrads: 23,
            TotBrokerage: "20,000",
        });
    })
    .catch(err => {
        console.error("Error:", err);
    });
})

app.get("/Positions", (req, res)=>{
    

    //! Check for new Positions bought, add them to DB. 
    //! Check if it is equity/future etc and add to total number
    //! Add to calendar equity/futures for the day
    //! Add in total brokerage
    //! Add in total brokerage
    //! If max profit, update also best day for trading, best strategy, best Lot Size
    //! Check if max loss
    // const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7','Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7','Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7','Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7'];
    
    const options = {
        method: 'GET',
        url: 'https://api.dhan.co/positions',
        headers: {'access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzEzODc0NTY2LCJ0b2tlbkNvbnN1bWVyVHlwZSI6IlNFTEYiLCJ3ZWJob29rVXJsIjoiIiwiZGhhbkNsaWVudElkIjoiMTEwMDY4NzY5NyJ9.d2Bu7gDAE5u7WPT-VQ4LAq-stLgSNKHOB92aXSFZNCUQkRa9x5sB5c9XA6rHXzUTYstm-qENS5ijVUIMH1et1g', Accept: 'application/json'}
    };
    
    var items= []
    request(options, function (error, response, body) {
        console.log(JSON.parse(body));
        if (error) throw new Error(error);
        items= JSON.parse(body);
        if(items.length == 0)
        {
            items= []
        }
        else
            items= items.concat(JSON.parse(body));
        items= JSON.parse(body);

        var hasRecording = new Boolean(0);
        const googleClientId= "2vsdf12";
        var themeThis= "none";
        getThemeById(googleClientId)
        .then(theme => {
            // console.log("Strategies:", strategies);
            themeThis= theme;
            console.log("Theme this:"+ themeThis);
            res.render("Positions.ejs", 
            {
                theme: themeThis,
                PageTitle: "Positions",
                Name: "Piyush",
                list: items, 
                isavailable: hasRecording
            });
        })
        .catch(err => {
            console.error("Error:", err);
        });
        
       
    });

    
})

app.get("/Holdings", (req, res)=>{
    
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
        const googleClientId= "2vsdf12";
        var themeThis= "none";
        getThemeById(googleClientId)
        .then(theme => {
            // console.log("Strategies:", strategies);
            themeThis= theme;
            console.log("Theme this:"+ themeThis);
            res.render("Holdings.ejs", 
            {
                theme: themeThis,
                PageTitle: "Holdings",
                Name: "Piyush",
                list: items, 
                isavailable: hasRecording
            });
        })
        .catch(err => {
            console.error("Error:", err);
        });
        
    });
  
    
})

app.get("/Reports", (req, res)=>{
    var themeThis= "none";
    const googleClientId= "2vsdf12";
        getThemeById(googleClientId)
        .then(theme => {
            // console.log("Strategies:", strategies);
            themeThis= theme;
            console.log("Theme this:"+ themeThis);
            res.render("Report.ejs", 
            {
                theme: themeThis,
                PageTitle: "Report",
                Name: "Piyush",
                BestStrats: "Trendline",
                BestTimeSlot: "Morning",
                BestDay: "Monday",
                BestLot: 20000,
                BigPro: 2300,
                BigLoss: 120
            });
        })
        .catch(err => {
            console.error("Error:", err);
        });
    
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


app.get("/Strategies", (req, res)=>{
    
    // const items = ['Strat 1', 'Start 2', 'STrat 3', 'Strat 4', 'Strat 5', 'Strat 6'];
    var items= [];
    const googleClientId= "2vsdf12";
    // const googleClientId= req.session.googleClientId;
    getStrategiesByClientId(googleClientId)
    .then(strategies => {
        // console.log("Strategies:", strategies);
        items= strategies;
        var themeThis= "none";
        getThemeById(googleClientId)
        .then(theme => {
            // console.log("Strategies:", strategies);
            themeThis= theme;
            console.log("Theme this:"+ themeThis);
            res.render("Strategies.ejs", 
            {
                theme: themeThis,
                PageTitle: "Strategies",
                Name: "Piyush",
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
    
})
app.post("/Strategies", async (req, res) => {
    // console.log(req.body);
    newStrat= req.body.Strat;
    // console.log("New strategy is: "+newStrat);
    if(newStrat.length == 0 || newStrat==null || String(newStrat).trim().length == 0)
        res.redirect("/Strategies")
    
    else {
    
        const googleClientId= "2vsdf12";
        const strategyName = newStrat; 

        try {
        
            // Find the user by google_client_id
            const user = await User.findOne({ google_client_id: googleClientId });
            // console.log(user);
            if (!user) {
            return res.status(404).json({ error: 'User not found' });
            }
            // console.log(user.Strategies);
            user.Strategies.push(newStrat);
        
            // Save the updated user document
            await user.save();
            // console.log("Strategy addded successfully");

        } catch (error) {
            // console.error('Error adding strategy:', error);
        }
        res.redirect("/Strategies")
    }
})

app.post("/del-strategy", async function (req, res) {
    // console.log(req.body);
    const googleClientId= "2vsdf12";
    const strategyToDelete= req.body.submitStrat;
    try {
        const user = await User.findOne({ google_client_id: googleClientId });
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        user.Strategies = user.Strategies.filter(strategy => strategy !== strategyToDelete);
    
        await user.save();
    
        // console.log('Strategy deleted successfully');
        res.redirect("Strategies")
      } catch (error) {
        // console.error('Error deleting strategy:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
})

async function getThemeById(googleClientId) {
    try {
        // Find the user with the given google_client_id
        const user = await User.findOne({ google_client_id: googleClientId });

        if (!user) {
            // console.log("User not found");
            return ""; // Return an empty array if user not found
        }

        // Access the Strategies field from the user document
        const theme = user.theme;

        return theme;
    } catch (error) {
        // console.error("Error fetching strategies:", error);
        return []; // Return an empty array in case of error
    }
}

app.get("/Profile", (req, res)=>{
    var themeThis= "none";
    const googleClientId= "2vsdf12";
    // const googleClientId= req.session.googleClientId;
    getThemeById(googleClientId)
    .then(theme => {
        // console.log("Strategies:", strategies);
        themeThis= theme;
        console.log("Theme this:"+ themeThis);
        res.render("Profile.ejs", 
        {
            theme: themeThis,
            PageTitle: "Profile",
            Name: "Piyush",
            imgSrc: "/test-images/piyush.jpg",
            fullName: "Piyush Khanna",
            dhanClientID: "678-32-23432-1",
            HQClientID: "2004-2813-cd-12",
            userEmail: "piyushkhannavb@gmail.com",
            userContact: "+91 8439363900",
            accType: "Trial",
            endDate: "20th Sept, 2069"
        });
    })
    .catch(err => {
        console.error("Error:", err);
    });
});

app.post('/toggle', async function (req, res) {
    const dataReceived = req.body;
    console.log(dataReceived);
    const theme = dataReceived.theme;
    const clientId= "2vsdf12";
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

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/ShareLog', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    const googleClientId = req.user.googleClientId; // Assuming req.user contains user data from authentication
    req.session.googleClientId = googleClientId;
    res.redirect('/');
  });

app.get('/auth/google/callback', (req, res) => {
    const googleClientId = req.user.googleClientId; // Assuming req.user contains user data from authentication
    req.session.googleClientId = googleClientId;
    // Redirect or perform other actions after authentication
});

app.get("/Login", function(req, res) {
    if(req.isAuthenticated()) {
        console.log("Apna hi launda hai.")
        res.redirect("/")
    } else {
        res.render("Login")
    }
}) 


app.listen(port, ()=>{
    console.log(`server running on port: ${port}`)
})