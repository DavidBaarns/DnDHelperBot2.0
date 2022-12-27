const { Client, GatewayIntentBits } = require('discord.js')
require('dotenv/config')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

client.on('ready', () => {
    console.log(`${client.user.tag} logged in`);
})

client.on('messageCreate', (message) => {

    if (message.content.toLowerCase().startsWith('!roll')) {
        roll(message);

    }

})
function roll(message) {
    // This code should be inside an event listener for a message event
    const channel = message.channel;
    const channelName = channel.name;

    // This code should be inside an event listener for a message event
    const guild = message.guild;
    const serverName = guild.name;



    //Get current date and time
    let currentDate = new Date();
    let formattedDate = currentDate.toLocaleDateString();
    let options = { hour: "numeric", minute: "numeric", second: "numeric", hour12: true };
    let formattedTime = currentDate.toLocaleTimeString("en-US", options);
    let logTimeAndUser = formattedDate + " " + formattedTime + " " + "Server: " + serverName + " Channel: " + channelName + " User: " +  message.member.displayName + " ";

    // Parse the command and the dice string
    messageLower = message.content.toLowerCase();
    const [, diceString] = messageLower.split(' ');

    // Check if dice string is empty first
    if (!diceString) {
        message.reply("Invalid dice string. The correct format is NdX+M, where N is the number of dice, X is the type of dice, and M is the optional modifier.");
        console.log(logTimeAndUser + "Error: diceString is empty");
        return;
    }

    // Check if the dice string is in the correct format
    if (!diceString.match(/^\d+d\d+(?:\+\d+|-\d+)?$/)) {
        console.log(logTimeAndUser + "Error, incorrect dice format");
        message.reply('Invalid dice string. The correct format is NdX+M, where N is the number of dice, X is the type of dice, and M is the optional modifier.');
        return;
    }

    // Get the base dice roll and the modifier
    const diceStringParts = diceString.split(/d/);
    const numDice = diceStringParts[0];
    const diceTypeString = diceStringParts[1];
    const diceType = parseInt(diceTypeString, 10);

    // Use a regular expression to capture the plus or minus sign and the modifier
    const modifierRegex = /([+-])(\d+)/;
    const modifierMatch = diceString.match(modifierRegex);

    // Create a message with the result of the dice roll
    let rollMessage = `Rolled ${diceString}: `;
    let roll = 0;
    for (let i = 0; i < numDice; i++) {
        const diceRoll = Math.floor(Math.random() * diceType) + 1;
        if (i > 0) {
            rollMessage += ' + ';
        }
        if (diceType == 20) {
            if (diceRoll == 20) {
                rollMessage += "___***"
                rollMessage += diceRoll;
                rollMessage += "***___"
            }
            else if (diceRoll == 1) {
                rollMessage += "___***"
                rollMessage += diceRoll;
                rollMessage += "***___"
            }
            else {
                rollMessage += diceRoll;
            }
        }
        else {
            rollMessage += diceRoll;

        }

        roll += diceRoll;
    }

    // Check if a modifier was found
    if (modifierMatch) {
        // Parse the modifier as an integer
        const modifier = parseInt(modifierMatch[2], 10);

        // Add or subtract the modifier from the roll and update the roll message
        if (modifierMatch[1] === '-') {
            roll -= modifier;
            rollMessage += ` - ${modifier} = ${roll}`;
        } else {
            roll += modifier;
            rollMessage += ` + ${modifier} = ${roll}`;
        }
    } else {
        rollMessage += ` = ${roll}`;
    }

    console.log(logTimeAndUser + rollMessage);

    message.reply(message.member.displayName + " " + rollMessage);
}
client.login(process.env.TOKEN)
