const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function menu() {
    console.log("\nChoose an option:");
    console.log("1. Create a file");
    console.log("2. Read a file");
    console.log("3. Append to a file");
    console.log("4. Rename a file");
    console.log("5. Delete a file");
    console.log("6. Exit");

    rl.question("Enter your choice: ", (choice) => {
        switch (choice) {
            case '1':
                createFile();
                break;
            case '2':
                readFile();
                break;
            case '3':
                appendToFile();
                break;
            case '4':
                renameFile();
                break;
            case '5':
                deleteFile();
                break;
            case '6':
                rl.close();
                break;
            default:
                console.log("Invalid choice. Please try again.");
                menu();
        }
    });
}

function createFile() {
    rl.question("Enter the filename: ", (filename) => {
        rl.question("Enter the content: ", (content) => {
            fs.writeFile(filename, content, (err) => {
                if (err) throw err;
                console.log("File created!");
                menu();
            });
        });
    });
}

function readFile() {
    rl.question("Enter the filename to read: ", (filename) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
            } else {
                console.log(data.toString());
            }
            menu();
        });
    });
}

function appendToFile() {
    rl.question("Enter the filename to append to: ", (filename) => {
        rl.question("Enter the content to append: ", (content) => {
            fs.appendFile(filename, content, (err) => {
                if (err) {
                    console.error("Error appending to file:", err);
                } else {
                    console.log("File updated!");
                }
                menu();
            });
        });
    });
}

function renameFile() {
    rl.question("Enter the current filename: ", (oldName) => {
        rl.question("Enter the new filename: ", (newName) => {
            fs.rename(oldName, newName, (err) => {
                if (err) {
                    console.error("Error renaming file:", err);
                } else {
                    console.log("File name updated!");
                }
                menu();
            });
        });
    });
}

function deleteFile() {
    rl.question("Enter the filename to delete: ", (filename) => {
        fs.unlink(filename, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            } else {
                console.log("File deleted successfully!");
            }
            menu();
        });
    });
}

menu();