import { glob } from 'glob';
import { parse } from 'node-html-parser';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

const cwd = process.cwd();
const inputDir = path.join(cwd, 'svg');
const inputDirRelative = path.relative(cwd, inputDir);
const outputDir = path.join(cwd, 'public', 'icons');
const namesDir = path.join(cwd, 'lib', 'types');

// const outputDirRelative = path.relative(cwd, outputDir);

const buildIcons = async () => {
    const files = glob
        .sync('**/*.svg', {
            cwd: inputDir,
        })
        .sort((a, b) => a.localeCompare(b));
    if (files.length === 0) {
        console.log(`No SVG files found in ${inputDirRelative}`);
        process.exit(0);
    }

    console.log(`Generating sprite for ${inputDirRelative}`);

    const spritesheetContent = await generateSvgSprite({
        files,
        inputDir,
    });

    await writeIfChanged(path.join(outputDir, 'sprite.svg'), spritesheetContent);

    async function generateSvgSprite({ files, inputDir }: { files: string[]; inputDir: string }) {
        const symbols = await Promise.all(
            files.map(async file => {
                const input = await fs.readFile(path.join(inputDir, file), 'utf8');
                const root = parse(input);
                const svg = root.querySelector('svg');
                if (!svg) throw new Error('No SVG element found');
                svg.tagName = 'symbol';
                svg.setAttribute('id', file.replace(/\.svg$/, ''));
                svg.removeAttribute('xmlns');
                svg.removeAttribute('xmlns:xlink');
                svg.removeAttribute('version');
                svg.removeAttribute('width');
                svg.removeAttribute('height');
                return svg.toString().trim();
            })
        );
        return [
            `<?xml version="1.0" encoding="UTF-8"?>`,
            `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">`,
            `<defs>`,
            ...symbols,
            `</defs>`,
            `</svg>`,
        ].join('\n');
    }

    const typesContent = generateTypes({
        names: files.map(file => JSON.stringify(file.replace(/\.svg$/, ''))),
    });

    await writeIfChanged(path.join(namesDir, 'icons.ts'), typesContent);

    function generateTypes({ names }: { names: string[] }) {
        return [`export type IconName =`, ...names.map(name => `\t| ${name}`), ''].join('\n');
    }

    async function writeIfChanged(filepath: string, newContent: string) {
        const currentContent = await fs.readFile(filepath, 'utf8');
        if (currentContent !== newContent) {
            return fs.writeFile(filepath, newContent, 'utf8');
        }
    }
};

void buildIcons();
