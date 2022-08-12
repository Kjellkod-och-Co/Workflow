const dotenv = require('dotenv');
const Discord = require('discord.js');
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

// Initialize dotenv & Discord
dotenv.config();
client.login(process.env.DISCORD_TOKEN);

// When message is recieved in Server
client.on('messageCreate', async message => {
    const prefix = "!";
    if (message.author.bot || !message.content.startsWith(prefix)) {
        return;
    }

    if (message.channelId === process.env.TESTING_ID) {
        console.log('in the right place');
        // Do something.
        doSomething(message, prefix);
    } else {
        // Don't do anything.
        return;
    }

});

const doSomething = async (message, prefix) => {
    const messageBody = message.content.slice(prefix.length);
    const args = messageBody.split(' ');
    const query = args.shift().toLocaleLowerCase();
    const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('select').setPlaceholder('Välj ett alternativ').addOptions([
        {
            label: 'Hjälp med App idé',
            description: 'Här kan du fråga mig om vad din nya App ska handla om!',
            value: 'help-with-app',
        },
        // TODO: Yttligare idéer?
        // {
        //     label: 'You can select me too',
        //     description: 'This is also a description',
        //     value: 'Gustav är bäst',
        // },
    ]),
    );

    const header = 'Välkommen till WorkFlow.\n Välj ett alternativ för att fortsätta.';
    await message.reply({ content: header, components: [row] });
};

client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;

    // *** Initial start of Workflow!
    if (interaction.customId === 'select' && interaction.values[0] === 'help-with-app') {
        const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('select').setPlaceholder('Korrekt?').addOptions([
            {
                label: 'Ja',
                description: 'Gå vidare till nästa steg',
                value: 'help-with-app-1',
            },
            {
                label: 'Nej',
                description: 'Jag klarar mig själv',
                value: 'end-help',
            },
        ]),
        );
    
        const header = 'Du valde att be om hjälp med din nya App.';
        await interaction.reply({ content: header, components: [row] });
    }

    if(interaction.values[0] === 'end-help') {
       await interaction.reply('Ok, lycka till ' + interaction.user.username);
    }

    if(interaction.values[0] === 'help-with-app-1') {
        const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('select-help-with-app').setPlaceholder('Har du en API?').addOptions([
            {
                label: 'Ja',
                description: 'Gå vidare till nästa steg',
                value: 'help-with-app-api-ja',
            },
            {
                label: 'Nej',
                description: 'Gå tillbaka till föregående meny',
                value: 'help-with-app-api-nej',
            },
        ]),
        );
        const header = "Ok! Let's go....";
        await interaction.reply({content: header, components: [row]});
    }

    if(interaction.values[0] === 'help-with-app-api-ja') {
        const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('select-help-with-app').setPlaceholder('Nästa steg?').addOptions([
            {
                label: 'Ja',
                description: 'Gå vidare till nästa steg',
                value: 'end-help',
            },
            {
                label: 'Nej',
                description: 'Gå tillbaka till föregående meny',
                value: 'help-with-app',
            },
        ]),
        );
        const header = "Ok. Du har ett API";
        await interaction.reply({content: header, components: [row]});
    }

    if(interaction.values[0] === 'help-with-app-api-nej') {
        const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('select-help-with-app').setPlaceholder('Vill du öppna länken i webbläsaren?').addOptions([
            {
                label: 'Ja',
                description: 'Jag vill klicka på länken',
                value: 'help-with-app-open-link',
            },
            {
                label: 'Nej',
                description: 'Jag vill gå tillbaka ett steg',
                value: 'help-with-app-3',
            },
        ]),
        );
        const header = "Vad vill du göra? 1";
        const link = new MessageEmbed().setURL('https://github.com/toddmotto/public-apis#index').setDescription('https://github.com/toddmotto/public-apis#index').addField('Public APIs', 'klicka på länken för att kolla', true);
        await interaction.reply({content: header, embeds: [link]});
    }

    if(interaction.values[0] === 'help-with-app-api-nej') {
        const row = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId('select-help-with-app').setPlaceholder('Vill du öppna länken i webbläsaren?').addOptions([
            {
                label: 'Ja',
                description: 'Jag vill klicka på länken',
                value: 'help-with-app-open-link',
            },
            {
                label: 'Nej',
                description: 'Jag vill gå tillbaka ett steg',
                value: 'help-with-app-no-open-link',
            },
        ]),
        );
        const header = "Vad vill du göra? 2";
        const link = new MessageEmbed().setURL('https://github.com/toddmotto/public-apis#index').setDescription('https://github.com/toddmotto/public-apis#index').addField('Public APIs', 'klicka på länken för att kolla', true);
        await interaction.reply({content: header, embeds: [link]});
    }
});