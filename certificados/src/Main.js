let folders = [];
let data;


async function lists() {
  const fet = await fetch("https://www.desma.com.mx/api/extras/aulas", {
    method: "OPTIONS",
  });

  data = await fet.json();
  console.log(data)
}

lists();

if (data === undefined) {
  setTimeout(() => {
  }, 2000)
}

async function getLists() {
  const email = document.getElementById("email").value;
  const url = `https://api.sendinblue.com/v3/contacts/${email}`;
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "api-key":
        "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",
    },
  };

  let listNames = []

  await fetch(url, options)
    //Get lists names by ids
    .then((response) => {
      if (response.status === 404) {
        error.innerHTML =
          "No estás registrado en ningún taller, si tienes dudas puedes escribirnos a apropiacion@aulasamigas.com";
        document.getElementById("email").classList.add("is-invalid");
      } else if (response.status === 400) {
        error.innerHTML =
          'Porfavor ingrese un email valido, como "example@example.com"';
        document.getElementById("email").classList.add("is-invalid");
      } else if (response.status === 200) {
        error.innerHTML = " ";
        document.getElementById("email").classList.remove("is-invalid");
        return response.json();
      }
    })
    .then((response) => {
      const listContact = response.listIds;
      fetch("https://api.sendinblue.com/v3/contacts/folders/42/lists?limit=50", options)
        .then((response) => response.json())
        .then((response) => {
          //Get array of lists on the folder
          const listFolder = response.lists;

          const commons = () => {
            let names = []
            for (let i = 0; i < Object.keys(listFolder).length; i++) {
              const currentpos = Object.values(listFolder)[i]
              console.log(currentpos)
              if (listContact.includes(currentpos.id)) {
                names = [...names, currentpos.name]
              }
            }
            return names
          }
          console.log(listFolder, listContact)

          const names = commons()
          console.log(names)

          if (names.length === 0) {
            error.innerHTML =
              "No esta registrado en los talleres, registrese aqui";
          } else {
            const div = document.getElementById("cont-list");
            div.innerHTML =
              '<label for="list" class="fontW label">Certificado</label> <select class="select" value="Todos" name="list" id="list"></select>';
            const select = document.getElementById("list");
            select.innerHTML = '<option value="Todos">Todos</option>';

            //Put the common list's names on the select

            names.map(i => console.log(i))
            names.forEach(name => {
              const Option = document.createElement("OPTION")
              const OptionVal = document.createTextNode(name)

              Option.appendChild(OptionVal);
              select.insertBefore(Option, select.firstChild);
              //hide button
              const btn = document.getElementById("bt1");
              const btn2 = document.getElementById("bt2");
              btn.style.display = "none";
              btn2.style.display = "inline";

              //delete the error message
              error.innerhtml = " ";
            })
          }
        })
        .catch((err) => {
          console.log(err);
          error.innerHTML =
            "No esta registrado en los talleres, registrese aqui";
        });
    })
    .catch((err) => {
      console.log(err);
      error.innerHTML = "No esta registrado en los talleres, registrese aqui";
    });
}

// fuunciion PDF
async function pdf() {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const email = document.getElementById("email").value;
  const url = `https://api.sendinblue.com/v3/contacts/${email}`;
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "api-key":
        "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",
    },
  };


  await fetch(url, options)
    .then((response) => {
      if (response.status === 404) {
        error.innerHTML = "Contacto no existente, porfavor registrate aqui";
        document.getElementById("email").classList.add("is-invalid");
      } else if (response.status === 400) {
        error.innerHTML =
          'Porfavor ingrese un email valido, como "example@example.com"';
        document.getElementById("email").classList.add("is-invalid");
      } else if (response.status === 200) {
        return response.json();
      }
    })
    .then((response) => {
      const { attributes } = response;
      const lists = response.listIds;
      const select = document.getElementById("list").value;
      const name = `${attributes.NOMBRE} ${attributes.APELLIDOS}`;
      const { PDFDocument, rgb } = PDFLib;

      const dpi = attributes.DOCUMENTO_PERSONAL_IDENTIFICACION_DPI


      if (select == "Todos") {
        for (let i = 0; i < lists.length; i++) {
          const listId = lists[i];
          fetch(
            `https://api.sendinblue.com/v3/contacts/lists/${listId}`,
            options
          )
            .then((response) => response.json())
            .then((response) => {
              async function embedFontAndMeasureText() {
                // Fetch custom font

                console.log(response)

                const fontBytes = await fetch(
                  "https://firebasestorage.googleapis.com/v0/b/d-webapp-4f6e4.appspot.com/o/fonts%2fLato-Regular.ttf?alt=media&token=18bda887-1349-415e-afdb-193a5f38d3f9"
                ).then(async (res) => await res.arrayBuffer());

                if (!data || Object.values(data).length === undefined) return
                for (let i = 0; i < Object.values(data).length; i++) {
                  const currentList = Object.values(data).filter(
                    (item) => item.id === listId
                  );

                  if (currentList.length > 0 && currentList !== undefined) {
                    if (Object.values(data)[i].id === listId) {
                      const exBytes = await fetch(`${currentList[0].url}`).then(
                        (res) => res.arrayBuffer()
                      );

                      console.log(Object.values(data)[i].timeCreated)

                      // Create a new PDFDocument
                      const pdfDoc = await PDFDocument.load(exBytes);

                      // Register the `fontkit` instance
                      pdfDoc.registerFontkit(fontkit);

                      // Embed our custom font in the document
                      const customFont = await pdfDoc.embedFont(fontBytes);

                      // Add a blank page to the document
                      const pages = pdfDoc.getPages();
                      const page = pages[0];

                      // Create a string of text and measure its width and height in our custom font
                      const text = name.toUpperCase();
                      const textSize = 28;
                      const textWidth = customFont.widthOfTextAtSize(
                        text,
                        textSize
                      );
                      //const textHeight = customFont.heightAtSize(textSize)
                      const { width } = page.getSize();

                      //Date
                      let date = new Date();
                      const dia = `${date.getDate()}`;
                      const mes = `${monthNames[date.getMonth()]}`;
                      const year = `${date.getFullYear()}`;

                      // Draw the string of text on the page
                      page.drawText(text, {
                        x: (width - textWidth) / 2,
                        y: 338,
                        size: textSize,
                        font: customFont,
                        color: rgb(1, 1, 1),
                      });

                      page.drawText(dia, {
                        x: 413,
                        y: 115,
                        size: 16,
                        font: customFont,
                        color: rgb(0.14, 0.32, 0.41),
                      });

                      page.drawText(mes, {
                        x: 532,
                        y: 115,
                        size: 16,
                        font: customFont,
                        color: rgb(0.14, 0.32, 0.41),
                      });

                      page.drawText(year, {
                        x: 625,
                        y: 115,
                        size: 16,
                        font: customFont,
                        color: rgb(0.14, 0.32, 0.41),
                      });


                      if (new Date(Object.values(data)[i].timeCreated) > new Date("2022-11-25T21:54:44.855Z")) {
                        if (dpi !== undefined || dpi.length !== undefined || dpi.length !== 0 || dpi !== null) {
                          page.drawText(dpi, {
                            x: (width / 2) - 15,
                            y: 300,
                            size: 16,
                            font: customFont,
                            color: rgb(1, 1, 1),
                          })
                        }
                      }

                      // Serialize the PDFDocument to bytes (a Uint8Array)
                      const pdfBytes = await pdfDoc.save();

                      // Trigger the browser to download the PDF document
                      download(
                        pdfBytes,
                        `${currentList[0].name}.pdf`,
                        "application/pdf"
                      );

                      //Shows pdf on iframe at html
                      const uri = await pdfDoc.saveAsBase64({ dataUri: true });
                      document.querySelector("#mypdf").src = uri;
                      //Execite func that generates pdf
                    }
                  } else {
                    return;
                  }
                }
              }
              embedFontAndMeasureText();
            })
            .catch((err) => console.error(err));
        }
      } else {
        async function embedFontAndMeasureText() {
          // Fetch custom font
          console.log(response)


          if (!data || Object.values(data).length === undefined) return
          const currentlist = Object.values(data).filter(
            (item) => item.name.trim() === select.trim()
          );
          const fontBytes = await fetch(
            "https://firebasestorage.googleapis.com/v0/b/d-webapp-4f6e4.appspot.com/o/fonts%2fLato-Regular.ttf?alt=media&token=18bda887-1349-415e-afdb-193a5f38d3f9"
          ).then(async (res) => await res.arrayBuffer());

          const exBytes = await fetch(`${currentlist[0].url}`)
            .then(async (res) => await res.arrayBuffer())
            .catch((err) => console.error(err));

          // Create a new PDFDocument
          const pdfDoc = await PDFDocument.load(exBytes);

          // Register the `fontkit` instance
          pdfDoc.registerFontkit(fontkit);

          // Embed our custom font in the document
          const customFont = await pdfDoc.embedFont(fontBytes);

          // Add a blank page to the document
          const pages = pdfDoc.getPages();
          const page = pages[0];

          // Create a string of text and measure its width and height in our custom font
          const text = name.toUpperCase();
          const textSize = 28;
          const textWidth = customFont.widthOfTextAtSize(text, textSize);
          //const textHeight = customFont.heightAtSize(textSize)
          const { width } = page.getSize();
          //Date
          let date = new Date();
          const dia = `${date.getDate()}`;
          const mes = `${monthNames[date.getMonth()]}`;
          const year = `${date.getFullYear()}`;

          // Draw the string of text on the page
          page.drawText(text, {
            x: (width - textWidth) / 2,
            y: 338,
            size: textSize,
            font: customFont,
            color: rgb(1, 1, 1),
          });

          page.drawText(dia, {
            x: 418,
            y: 115,
            size: 16,
            font: customFont,
            color: rgb(0.14, 0.32, 0.41),
          });

          page.drawText(mes, {
            x: 508,
            y: 115,
            size: 16,
            font: customFont,
            color: rgb(0.14, 0.32, 0.41),
          });

          page.drawText(year, {
            x: 623,
            y: 115,
            size: 16,
            font: customFont,
            color: rgb(0.14, 0.32, 0.41),
          });

          console.log(currentlist)

          if (new Date(currentlist[0].timeCreated) > new Date("2022-11-25T21:54:44.855Z")) {
            if (dpi !== undefined || dpi.length !== undefined || dpi.length !== 0 || dpi !== null) {
              page.drawText(dpi, {
                x: (width / 2) - 15,
                y: 300,
                size: 16,
                font: customFont,
                color: rgb(1, 1, 1),
              })
            }
          }          // Serialize the PDFDocument to bytes (a Uint8Array)
          const pdfBytes = await pdfDoc.save();

          // Trigger the browser to download the PDF document
          download(pdfBytes, `${currentlist[0].name}.pdf`, "application/pdf");

          //Shows pdf on iframe at html
          const uri = await pdfDoc.saveAsBase64({ dataUri: true });
          document.querySelector("#mypdf").src = uri;
        }

        //Execite func that generates pdf
        embedFontAndMeasureText();
      }
    });
}
