export let azaleaEnv = {
    "Version": 0,
    "IsDevVersion": true,
    "Credits": [
        "§a[§b+§a] §7Azalea",
        "§dTRASH - Main developer"
    ],
    "AboutAddonName": "§aAzalea",
    "Behavior": {
        "BitwiseToggles": false,
        "PasswordHashing": true,
        "PasswordHashingAlgorithm": "SHA-256"
    },
    "DownloadedSource": 5,
    "InjectionModVersion": 1,
    "APIS": {
        "InvitationAPI": true,
        "NoInvitationApiCodeLength": 4
    },
    "DefaultPronounsList": [
        "he/him",
        "she/her",
        "they/them",
        "whatever/the/fk/you/want"
    ],
    "UserID_System": "UniqueID-From-Name-Or-Number",
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
};
