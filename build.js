import ejs from "ejs";
import fs from "fs-extra";
import path from "path";

const viewsDir = path.join(__dirname, "views"); 
const outDir = path.join(__dirname, "dist"); 

fs.ensureDirSync(outDir);

fs.readdir(viewsDir, (err, files) => {
	if (err) throw err;

	files.forEach(file => {
		const filePath = path.join(viewsDir, file);
		const outFile = path.join(outDir, file.replace(".ejs", ".html"));

		ejs.renderFile(filePath, {}, (err, str) => {
			if (err) throw err;

			fs.writeFile(outFile, str, err => {
				if (err) throw err;
				console.log(`Generated: ${outFile}`);
			});
		});
	});
});
