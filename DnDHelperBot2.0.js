const { Client, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js')
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
    if (message.content.toLowerCase().startsWith('!adv')) {
        advRoll(message, "adv");
    }
    if (message.content.toLowerCase().startsWith('!dis')) {
        advRoll(message, "dis");
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

    let logTimeAndUser = `${formattedDate} ${formattedTime} Server: ${serverName} Channel: ${channelName} User: ${message.member.displayName}`;

    // Parse the command and the dice string
    messageLower = message.content.toLowerCase();
    const [, diceString] = messageLower.split(' ');

    const invalidDiceStringMessage =
        'Invalid dice string. The correct format is NdX+M, where N is the number of dice, X is the type of dice, and M is the optional modifier.';

    // Check if dice string is empty first
    if (!diceString) {
        message.reply(invalidDiceStringMessage);
        console.log(`${logTimeAndUser} Message: ${message.content} | Error: diceString is empty`);
        return;
    }

    // Use a regular expression to capture the plus or minus sign and the modifier
    const diceFormatRegex = /^(\d+)d(\d+)([+-]\d+)?$/;
    const diceFormatMatch = diceString.match(diceFormatRegex);

    // Check if the dice string is in the correct format
    if (!diceFormatMatch) {
        console.log(`${logTimeAndUser} Message: ${message.content} | Error, incorrect dice format`);
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
    let diceRoll = 0;
    for (let i = 0; i < numDice; i++) {
        diceRoll = Math.floor(Math.random() * diceType) + 1;
        if (i > 0) {
            rollMessage += ' + ';
        }
        rollMessage += diceRoll;
        roll += diceRoll;
    }

    // Add the modifier to the roll if it was specified
    if (diceModifier !== 0) {
        roll += diceModifier;
        rollMessage += ` ${diceModifier > 0 ? '+' : '-'} ${Math.abs(diceModifier)}`;
    }

    // Send the roll message to the channel
    let displayName = message.member.displayName;

    // Check if display name contains [*], and if so extract text between the brackets
    let match = displayName.match(/\[(.*?)\]/);
    if (match) {
        displayName = match[1];
    }

    if (diceModifier === 0 && numDice === 1) {
        // No modifier and single dice, don't append roll to message
        finalMessage = `${displayName} ${rollMessage}`
    } else {
        // Modifier or multiple dice, append roll to message
        finalMessage = `${displayName} ${rollMessage} = ${roll}`;
    }
    if (numDice == 1 || diceType == 20) {
        if (diceRoll == 20) {
            nat(message, finalMessage, 20);
        }
        else if (diceRoll == 1) {
            nat(message, finalMessage, 1);
        }
        else {
            message.reply(finalMessage);
        }
    }
    else {
        message.reply(finalMessage);
    }

    console.log(`${logTimeAndUser} | ${diceString} = ${roll}`);
}


function advRoll(message, commandType) {
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

    let logTimeAndUserAdv =
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

    const invalidDiceStringMessage =
        'Invalid dice string. The correct format is NdX+M, where N is the number of dice, X is the type of dice, and M is the optional modifier.';

    // Check if dice string is empty first
    if (!diceString) {
        message.reply(invalidDiceStringMessage);
        console.log(`${logTimeAndUserAdv} Message: ${message.content} | Error: diceString is empty`);
        return;
    }

    // Use a regular expression to capture the plus or minus sign and the modifier
    const diceFormatRegex = /^(\d+)d(\d+)([+-]\d+)?$/;
    const diceFormatMatch = diceString.match(diceFormatRegex);

    // Check if the dice string is in the correct format
    if (!diceFormatMatch) {
        console.log(`${logTimeAndUserAdv} Message: ${message.content} | Error, incorrect dice format`);
        message.reply(invalidDiceStringMessage);
        return;
    }

    // Get the base dice roll and the modifier
    const numDice = parseInt(diceFormatMatch[1], 10);
    const diceType = parseInt(diceFormatMatch[2], 10);
    const diceModifier = diceFormatMatch[3] ? parseInt(diceFormatMatch[3], 10) : 0;

    // Create a message with the result of the dice roll
    let roll1 = 0;
    for (let i = 0; i < numDice; i++) {
        const diceRoll1 = Math.floor(Math.random() * diceType) + 1;
        roll1 += diceRoll1;
    }
    const roll1Result = roll1 + diceModifier;

    let roll2 = 0;
    for (let i = 0; i < numDice; i++) {
        const diceRoll2 = Math.floor(Math.random() * diceType) + 1;
        roll2 += diceRoll2;
    }
    const roll2Result = roll2 + diceModifier;

    let displayName = message.member.displayName;
    let match = displayName.match(/\[(.*?)\]/);
    if (match) {
        displayName = match[1];
    }

    if (commandType == "adv") {
        let rollMessage = `${displayName} rolled ${diceString} with advantage:\n`;
        rollMessage += `Roll 1: ${diceModifier !== 0 ? `${roll1} ${diceModifier > 0 ? '+' : '-'} ${Math.abs(diceModifier)} = ${roll1Result}` : roll1}\n`;
        rollMessage += `Roll 2: ${diceModifier !== 0 ? `${roll2} ${diceModifier > 0 ? '+' : '-'} ${Math.abs(diceModifier)} = ${roll2Result}` : roll2}\n`;
        let finalRoll = Math.max(roll1Result, roll2Result);
        rollMessage += `The higher roll is: ${finalRoll}`;
        console.log(`${logTimeAndUserAdv} Message: ${message.content} | Roll: ${rollMessage}`);
        if (Math.max(roll1, roll2) == 20) {
            nat(message, rollMessage, 20);
        } else {
            message.reply(rollMessage);
        }
    }

    if (commandType == "dis") {
        let rollMessage = `${displayName} rolled ${diceString} with disadvantage:\n`;
        rollMessage += `Roll 1: ${diceModifier !== 0 ? `${roll1} ${diceModifier > 0 ? '+' : '-'} ${Math.abs(diceModifier)} = ${roll1Result}` : roll1}\n`;
        rollMessage += `Roll 2: ${diceModifier !== 0 ? `${roll2} ${diceModifier > 0 ? '+' : '-'} ${Math.abs(diceModifier)} = ${roll2Result}` : roll2}\n`;
        let finalRoll = Math.min(roll1Result, roll2Result);
        rollMessage += `The lower roll is: ${finalRoll}`;
        console.log(`${logTimeAndUserAdv} Message: ${message.content} | Roll: ${rollMessage}`);
        if (Math.min(roll1, roll2) == 1) {
            nat(message, rollMessage, 1);
        } else {
            message.reply(rollMessage);
        }

    }
}

function nat(message, rollMessage, natNumber) {
    const file = new AttachmentBuilder(`./Gifs/Nat${natNumber}.gif`);
    const embed = new EmbedBuilder()
        .setTitle(`Nat ${natNumber}!`)
        .setImage(`attachment://Nat${natNumber}.gif`)
        .setDescription(rollMessage);
    message.reply({ embeds: [embed], files: [file] });
}


client.login(process.env.TOKEN)