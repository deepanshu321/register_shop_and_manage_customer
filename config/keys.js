//dbPassword = 'mongodb://deepanshu:Deep4321@cluster0-shard-00-00-8wynx.mongodb.net:27017,cluster0-shard-00-01-8wynx.mongodb.net:27017,cluster0-shard-00-02-8wynx.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'
dbPassword = 'mongodb+srv://deepanshu:Deep4321@cluster0-8wynx.mongodb.net/test?retryWrites=true&w=majority';
//mongodb+srv://deepanshu:<password>@cluster0-8wynx.mongodb.net/test?retryWrites=true&w=majority
module.exports = {
    mongoURI: dbPassword
};
