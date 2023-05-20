export let azaleaEnv:any = {
    "Version": 0, // the version number, starts at 0.9 and increases by 0.1 if you increase this by 1
    "IsDevVersion": true, // toggles some developer commands, might have a system to remove them from production later
    "Credits": [
        "§a[§b+§a] §7Azalea",
        "§dTRASH - Main developer"
    ], // you can modify this and remove the credits, but i dont get paid to make this addon, so it would be nice if you at least left the credits
    "AboutAddonName": "§aAzalea", // changes addon name
    "Behavior": {
        "BitwiseToggles": false, // experimental, will reset toggles
        "PasswordHashing": true, // irriversibly changes passwords before sending them to the database, this makes things more secure so you cant view the password in plain text
        "PasswordHashingAlgorithm": "SHA-256" // changes the hashing algorithm, currently SHA-256 is the only supported one
    },
    "DownloadedSource": 5, // 0 is Unknown, 1 is Website, 2 is Discord, 3 is MCPEDL, 4 is Website (Modded), 5 is Development Server
    "InjectionModVersion": 1,
    "APIS": {
        "InvitationAPI": true, // enables experimental automatic invite API, otherwise it will fall back to invite codes
        "NoInvitationApiCodeLength": 4
    },
    // I dont know if I should use this at all, im leaving the rest for server owners
    "DefaultPronounsList": [
        "he/him",
        "she/her",
        "they/them",
        "whatever/the/fk/you/want"
    ],
    "UserID_System": "UniqueID-From-Name-Or-Number", // Helps generate user ids
    "Overrides": [
        {
            "condition": "source = 0",
            "AboutAddonName": "§aAzalea (From unknown source, do not trust this version!)",
            "credits": [
                "§a[§b+§a] §7Azalea",
                "§dTRASH - Main developer",
                "§bLink: https://discord.gg/azalea-essentials"
            ]
        },
        {
            "condition": "source = 1",
            "AboutAddonName": "§aAzalea §b(from website)",
            "Credits": [
                "§a[§b+§a] §7Azalea",
                "§dTRASH - Main developer",
                "§bLink: https://azalea0.netlify.app/"
            ]
        },
        {
            "condition": "source = 2",
            "AboutAddonName": "§aAzalea §9(From Discord)",
            "Credits": [
                "§a[§b+§a] §7Azalea",
                "§dTRASH - Main developer",
                "§bLink: discord.gg/azalea-essentials"
            ]
        },
        {
            "condition": "source = 3",
            "AboutAddonName": "§aAzalea §2(from MCPEDL)",
            "Credits": [
                "§a[§b+§a] §7Azalea",
                "§dTRASH - Main developer",
                "§bLink: idk, i dont have an mcpedl link yet"
            ]
        },
        {
            "condition": "source = 4",
            "AboutAddonName": "§aAzalea §d(MODDED)",
            "Credits": [
                "§a[§b+§a] §7Azalea",
                "§dTRASH - Main developer",
                "§bLink (NO MODS): https://azalea0.netlify.app/",
                "§bLink (WITH MODS): https://azalea0.netlify.app/mods"
            ]
        },
        {
            "condition": "source = 5",
            "AboutAddonName": "§aAzalea §9D§3E§bV",
            "Credits": [
                "§cDO NOT LEAK"
            ]
        }
    ]
}