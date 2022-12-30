const { Client, GatewayIntentBits } = require('discord.js')
require('dotenv/config')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on('ready', () => {
    console.log(`${client.user.tag} logged in`);
});

client.on('messageCreate', (message) => {
    if (message.content.toLowerCase().startsWith('!roll')) {
        roll(message);
    }
});

function roll(message) {
    // This code should be inside an event listener for a message event
    const channel = message.channel;
    const channelName = channel.name;

    // This code should be inside an event listener for a message event
    const guild = message.guild;
    const serverName = guild.name;

    // Get current date and time
    let currentDate = new Date();
    let formattedDate = currentDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });
    let formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
    let formattedDateTime = `${formattedDate} ${formattedTime}`;
    
    let logTimeAndUser =
        formattedDate +
        ' ' +
        formattedTime +
        ' ' +
        'Server: ' +
        serverName +
        ' Channel: ' +
        channelName +
        ' User: ' +
        message.member.displayName +
        ' ';

    // Parse the command and the dice string
    messageLower = message.content.toLowerCase();
    const [, diceString] = messageLower.split(' ');

    // Check if dice string is empty first
    if (!diceString) {
        const invalidDiceStringMessage =
            'Invalid dice string. The correct format is NdX+M, where N is the number of dice, X is the type of dice, and M is the optional modifier.';
        message.reply(invalidDiceStringMessage);
        console.log(logTimeAndUser + 'Error: diceString is empty');
        return;
    }

    // Use a regular expression to capture the plus or minus sign and the modifier
    const diceFormatRegex = /^(\d+)d(\d+)([+-]\d+)?$/;
    const diceFormatMatch = diceString.match(diceFormatRegex);

    // Check if the dice string is in the correct format
    if (!diceFormatMatch) {
        console.log(logTimeAndUser + 'Error, incorrect dice format');
        message.reply(invalidDiceStringMessage);
        return;
    }

    // Get the base dice roll and the modifier
    const numDice = parseInt(diceFormatMatch[1], 10);
    const diceType = parseInt(diceFormatMatch[2], 10);
    const diceModifier = diceFormatMatch[3] ? parseInt(diceFormatMatch[3], 10) : 0;

    // Create a message with the result of the dice roll
    let rollMessage = `Rolled ${diceString}: `;
    let roll = 0;
    for (let i = 0; i < numDice; i++) {
        const diceRoll = Math.floor(Math.random() * diceType) + 1;
        if (i > 0) {
            rollMessage += ' + ';
        }
        if (diceType === 20) {
            if (diceRoll === 20) {
                rollMessage += '___***';
                rollMessage += diceRoll;
                rollMessage += '***___';
            } else if (diceRoll === 1) {
                rollMessage += '___***';
                rollMessage += diceRoll;
                rollMessage += '***___';
            } else {
                rollMessage += diceRoll;
            }
        } else {
            rollMessage += diceRoll;
        }
        roll += diceRoll;
    }

    // Add the modifier to the roll if it was specified
    if (diceModifier !== 0) {
        roll += diceModifier;
        rollMessage += ` ${diceModifier > 0 ? '+' : '-'} ${Math.abs(diceModifier)}`;
    }

    // Send the roll message to the channel
    if (diceModifier === 0 && numDice === 1) {
        // No modifier and single dice, don't append roll to message
        message.reply(message.member.displayName + ' ' + rollMessage);
    } else {
        // Modifier or multiple dice, append roll to message
        message.reply(message.member.displayName + ' ' + rollMessage + ` = ${roll}`);
    }
    console.log(logTimeAndUser + `${diceString} = ${roll}`);

}
client.login(process.env.TOKEN)
