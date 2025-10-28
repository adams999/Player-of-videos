function SimuAnalytics(disableAnalytics)
{


var shouldSend=true;
var kinesis;
var globalSessionId=randomString(10);


// Configure Credentials to use Cognito
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:4cdfcb34-19d5-492b-b5b9-488493a7d784'
});

AWS.config.region = 'us-east-1';
// We're going to partition Amazon Kinesis records based on an identity.
// We need to get credentials first, then attach our event listeners.
AWS.config.credentials.get(function(err) 
{
    // attach event listener
    if (err) 
    {
        alert('Error retrieving credentials.');
        console.error(err);
        return;
    }
    // create Amazon Kinesis service object
    kinesis=new AWS.Kinesis({
        apiVersion: '2013-12-02'
    });
    if(kinesis){
            
    }
    console.log(">>>ALL REAEDY<<<<<")
});

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function setCookie(name, value) {
    document.cookie = name + "=" + value + ";";
}

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

function getRandomNumber(min,max)
{
	return Math.floor(Math.random() * (+max - +min)) + +min; 
}


function getshopperId(){
    //var globalSessionId = document.shopperId
    var x = getCookie('shopperId')
    if(!x){
        x=getRandomNumber(1,5000).toString();
        setCookie('shopperId',x)
    }
    return x;
}




this.sendawsEvent=function(eventType,streamerId,streamId)
{
    if(disableAnalytics|| !kinesis)
        return;

    var time = moment();
    
    dataPacket = {};
    dataPacket.eventId=randomString(10);
    dataPacket.eventDate=time.format("YYYY-MM-DD");
    dataPacket.eventTime=time.format("YYYY-MM-DD HH:mm:ss");
    dataPacket.shopperId=getshopperId()
    dataPacket.streamerId=streamerId
    dataPacket.streamId=streamId
    dataPacket.sessionId=globalSessionId
    dataPacket.isDebugMode=true;
    dataPacket = Object.assign({},dataPacket,eventType)
    

    var flag = true
    var record = {
                Data: JSON.stringify(dataPacket)+ '\n',
                PartitionKey: 'partition-' + AWS.config.credentials.identityId
            };

       kinesis.putRecords({
            Records: [record],
            StreamName: 'SImuTest'
        }, function(err, data) 
        {
            if (err) 
            {
                console.error(err);
            }
        })
  
}

return this;

}