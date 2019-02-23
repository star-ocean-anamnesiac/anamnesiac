
const fs = require('fs');

fs.writeFileSync('www/_headers', `/*\r\n\tX-Commit: ${process.env.COMMIT_REF}`)