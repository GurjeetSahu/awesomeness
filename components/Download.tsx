import { Button } from "@/components/ui/button";

export default function DownLoadbtn(starred: any) {
  console.log(starred);
  const template = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          color: #333;
        }
        h1 {
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
        }
        h2 {
          color: #2980b9;I
          margin-top: 30px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          padding: 8px 0;
          border-bottom: 1px solid #eee;
          position: relative;
        }
        a {
          color: #000000;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .stars {
          color: #63552a;
          margin-left: 5px;
        }
        .manage-btn {
          margin-left: 10px;
          padding: 2px 5px;
          font-size: 12px;
          cursor: pointer;
        }
      </style>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Starred GitHub Repositories</title>
    </head>
    <body>
      <div id="output"></div>
      <script>
        const starredReposByTech = ${(JSON.stringify(starred.starred))}
  
        document.addEventListener("DOMContentLoaded", () => {
          const outputDiv = document.getElementById("output");
          renderCategories(starredReposByTech, outputDiv);
        });
  
        function renderCategories(data, outputDiv) {
          let html =
            '<h1>Starred GitHub Repositories</h1> <div class="category">';
          for (const category in data) {
            html += \`<h2>\${category}</h2>\`;
            
            data[category].forEach((repo) => {
              html += \`
            <li data-name="\${repo.name}" data-stars="\${repo.stars}">
              <a href="https://github.com/\${repo.name}">\${repo.name}</a> 
              <span class="stars">\${repo.stars / 1000} ⭐</span>
            </li>
          \`;
            });
            html += '</ul></div>';
          }
  
          outputDiv.innerHTML = html;
        }
      </script>
    </body>
  </html>`;
  return (
    <div>
      <Button
        onClick={() => {
          const url = URL.createObjectURL(
            new Blob([template], { type: "text/html" })
          );
          Object.assign(document.createElement("a"), {
            href: url,
            download: "index.html",
          }).click();
          URL.revokeObjectURL(url);
        }}
      >
        Download
      </Button>
    </div>
  );
}
