const mongose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');


const connectDB = async () => {
    try {
        await mongose.connect(db,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true,
             useFindAndModify: false 
            }

        );
        console.log('DB connected  ');

    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;