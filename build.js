
// const { zipFunction } = require('@netlify/zip-it-and-ship-it');
const fs = require('fs-extra');
const path = require('path');
const { minify } = require('terser');
const inputDir = './scripts/src';
const outputDir = './scripts/build';
const uuid = require('uuid');
let nextMajor = false;
if(process.argv.length > 2 && process.argv[2] == "--next") {
    nextMajor = true;
}
const walkSync = (dir, fileList = []) => {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = walkSync(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
};

const files = walkSync(outputDir);

for (const file of files) {
  if (path.extname(file) === '.js') {
    const code = fs.readFileSync(file, 'utf8');
    minify(code)
      .then((result) => {
        const outputPath = path.join(outputDir, path.relative(inputDir, file));
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, result.code, 'utf8');
      })
      .catch((error) => {
        console.error(`Failed to minify ${file}: ${error}`);
      });
  }
}

/*
		"description": "§9Now using op instead of admin tag, type !help for commands",
		"name": "§aAzalea V0.9.0 - Leaderboard update",

*/
let date = new Date();
let template = `
{
    "format_version": 2,
	"header": {
        "description": "Generated with the automatic development build generator. Please do not leak.",
        "name": "${date.getUTCMonth()+1}/${date.getUTCDate()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} UTC",
		"uuid": "{{UUID}}",
		"version": [
			0,
			0,
			1
		],
		"min_engine_version": [
			1,
			19,
			0
		]
	},
	"modules": [
		{
			"description": "Script that implements basic starter tests.",
			"type": "script",
			"language": "javascript",
			"uuid": "{{UUID}}",
			"version": [
				0,
				0,
				1
			],
			"entry": "scripts/main.js"
		},
		{
			"description": "Some useful things",
			"type": "data",
			"uuid": "{{UUID}}",
			"version": [
				0,
				0,
				1
			]
		}
	],
	"dependencies": [
		{
			"module_name": "@minecraft/server",
			"version": "1.1.0-beta"
		},
		{
			"module_name": "@minecraft/server-ui",
			"version": "1.0.0-beta"
		}
	]
}
`
fs.remove('./dev-build').then(()=>{
    fs.mkdir('./dev-build').then(()=>{
        fs.copy('./scripts/build', './dev-build/scripts').then(()=>{
            let templateNew = template.replace('{{UUID}}', uuid.v4());
            while(templateNew.includes('{{UUID}}')) {
                templateNew = templateNew.replace('{{UUID}}', uuid.v4());
            }
            fs.writeFile('./dev-build/manifest.json', templateNew).then(()=>{
                fs.readFile('./dev-build/scripts/env.js', (err,data)=>{
                    let ver = parseInt(data.toString().match(/Version\:([\s\S]*?)\,/g)[0].substring("Version:".length).slice(0,-1))+(nextMajor ? 1 : 0);
                    console.log(ver)
                    fs.writeFile('./dev-build/scripts/env.js',`export let azaleaEnv={"Version":${ver},"IsDevVersion":!0,"Credits":["§a[§b+§a] §7Azalea","§dTRASH - Main developer"],"AboutAddonName":"§aAzalea","Behavior":{"BitwiseToggles":!1,"PasswordHashing":!0,"PasswordHashingAlgorithm":"SHA-26"},"DownloadedSource":5,"InjectionModVersion":1,"APIS":{"InvitationAPI":!0,"NoInvitationApiCodeLength":4},"DefaultPronounsList":["he/him","she/her","they/them","whatever/the/fk/you/want"],"UserID_System":"UniqueID-From-Name-Or-Number","Overrides":[{"condition":"source = 0","AboutAddonName":"§aAzalea (From unknown source, do not trust this version!)","credits":["§a[§b+§a] §7Azalea","§dTRASH - Main developer","§bLink: https://discord.gg/azalea-essentials"]},{"condition":"source = 1","AboutAddonName":"§aAzalea §b(from website)","Credits":["§a[§b+§a] §7Azalea","§dTRASH - Main developer","§bLink: https://azalea0.netlify.app/"]},{"condition":"source = 2","AboutAddonName":"§aAzalea §9(From Discord)","Credits":["§a[§b+§a] §7Azalea","§dTRASH - Main developer","§bLink: discord.gg/azalea-essentials"]},{"condition":"source = 3","AboutAddonName":"§aAzalea §2(from MCPEDL)","Credits":["§a[§b+§a] §7Azalea","§dTRASH - Main developer","§bLink: idk, i dont have an mcpedl link yet"]},{"condition":"source = 4","AboutAddonName":"§aAzalea §d(MODDED)","Credits":["§a[§b+§a] §7Azalea","§dTRASH - Main developer","§bLink (NO MODS): https://azalea0.netlify.app/","§bLink (WITH MODS): https://azalea0.netlify.app/mods"]},{"condition":"source = 5","AboutAddonName":"§aAzalea §9D§3E§bV","Credits":["§cDO NOT LEAK"]}]}`).then(()=>{
                        fs.remove('./dev-build/scripts/modules/nautilus').then(()=>{
        
                        })
                    })
                })
            })
        })
    })
})
fs.remove('./discord-build').then(()=>{
    fs.mkdir('./discord-build').then(()=>{
        fs.copy('./scripts/build', './discord-build/scripts').then(()=>{

            fs.readFile('./discord-build/scripts/env.js', (err,data)=>{
                        let templateNew = template.replace('{{UUID}}', uuid.v4());
                    while(templateNew.includes('{{UUID}}')) {
                        templateNew = templateNew.replace('{{UUID}}', uuid.v4());
                    }
                    templateNew = JSON.parse(templateNew)
                    let ver = parseInt(data.toString().match(/Version\:([\s\S]*?)\,/g)[0].substring("Version:".length).slice(0,-1))+(nextMajor ? 1 : 0);
                    console.log(ver)
                    templateNew.header.name = `§aAzalea §2V${((ver/10)+0.9).toFixed(1)}`;
                    templateNew.header.description = `§dAsk any questions in the youtube channel! https://youtube.com/@azaleadev`
                    fs.writeFile('./discord-build/manifest.json', JSON.stringify(templateNew)).then(()=>{
                        fs.writeFile('./discord-build/scripts/env.js',`export let azaleaEnv={"Version":${ver},"IsDevVersion":!0,"Credits":["§a[§b+§a] §7Azalea","§dTRASH - Main developer"],"AboutAddonName":"§aAzalea","Behavior":{"BitwiseToggles":!1,"PasswordHashing":!0,"PasswordHashingAlgorithm":"SHA-26"},"DownloadedSource":2,"InjectionModVersion":1,"APIS":{"InvitationAPI":!0,"NoInvitationApiCodeLength":4},"DefaultPronounsList":["he/him","she/her","they/them","whatever/the/fk/you/want"],"UserID_System":"UniqueID-From-Name-Or-Number","Overrides":[{"condition":"source = 0","AboutAddonName":"§aAzalea (From unknown source, do not trust this version!)","credits":["§a[§b+§a] §7Azalea","§dTRASH - Main developer","§bLink: https://discord.gg/azalea-essentials"]},{"condition":"source = 1","AboutAddonName":"§aAzalea §b(from website)","Credits":["§a[§b+§a] §7Azalea","§dTRASH - Main developer","§bLink: https://azalea0.netlify.app/"]},{"condition":"source = 2","AboutAddonName":"§aAzalea §9(From Discord)","Credits":["§a[§b+§a] §7Azalea","§dTRASH - Main developer","§bLink: discord.gg/azalea-essentials"]},{"condition":"source = 3","AboutAddonName":"§aAzalea §2(from MCPEDL)","Credits":["§a[§b+§a] §7Azalea","§dTRASH - Main developer","§bLink: idk, i dont have an mcpedl link yet"]},{"condition":"source = 4","AboutAddonName":"§aAzalea §d(MODDED)","Credits":["§a[§b+§a] §7Azalea","§dTRASH - Main developer","§bLink (NO MODS): https://azalea0.netlify.app/","§bLink (WITH MODS): https://azalea0.netlify.app/mods"]},{"condition":"source = 5","AboutAddonName":"§aAzalea §9D§3E§bV","Credits":["§cDO NOT LEAK"]}]}`).then(()=>{
                        fs.remove('./discord-build/scripts/modules/nautilus').then(()=>{
        
                        })
                    })
                })
            })
        })
    })
})