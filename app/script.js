let id;
let moduleName;
ZOHO.embeddedApp.on("PageLoad", entity => {

  moduleName = entity?.Entity;
  id = entity?.EntityId;

  ZOHO.CRM.API.getRelatedRecords({
    Entity: moduleName,
    RecordID: id,
    RelatedList: "Tasks",
    page: 1,
    per_page: 200
  })
    .then(function (data) {

      let item = data?.data;


      if (item != undefined) {
        let newItem = [];
        let oldItem = [];

        for (let i = 0; i < item.length; i++) {

          if (item[i].Status === "Completed") {
            let newObject = {
              taskId: item[i].id.toString(),
              taskName: item[i].Subject,
              dueDate: item[i].Due_Date,
              createdDate: item[i].Created_Time.split('T')[0],
            }
            oldItem.push(newObject);
          }
          else {
            let newObject = {
              taskId: item[i].id.toString(),
              taskName: item[i].Subject,
              dueDate: item[i].Due_Date,
              createdDate: item[i].Created_Time.split('T')[0],
            };

            newItem.push(newObject);
          }
        }


        if (newItem.length == 0) {
          const div = document.querySelector('div');
          const h1 = document.createElement('h1');
          h1.textContent = "Open Task is not found!";
          div.appendChild(h1);
        }

        else {
          function createTable(newItem) {
            const table = document.createElement('table');
            table.id = 'openTable';
            table.style.width = '100%';


            const headers = ['Task Name', 'Due Date', 'Created Date', 'Status'];
            let headerRow = '<tr>';
            headers.forEach(header => {
              headerRow += `<th>${header}</th>`;
            });
            headerRow += '</tr>';
            table.innerHTML += headerRow;


            newItem.forEach(task => {

              let row = '<tr>';
              // Object.values(task).forEach(value => {
              //   console.log(value);
              //   row += `<td>${value}</td>`;
              // });

              Object.entries(task).forEach(([key, value]) => {
                if (key !== 'taskId') {
                  row += `<td>${value}</td>`;
                }
              });

              row += `<td><button class="status-btn" data-id="${task.taskId}" onclick="toggleStatus('${task.taskId}')">Change Status</button></td>`;

              console.log(row);
              row += '</tr>';
              table.innerHTML += row;
            });

            return table;
          }


          const div = document.getElementById('open');
          div.appendChild(createTable(newItem));
        }


        if (oldItem.length == 0) {
          const div = document.querySelector('div');
          const h1 = document.createElement('h1');
          h1.textContent = "Closed Task is not found!";
          div.appendChild(h1);
        }

        else {
          function createCloseTable(oldItem) {
            // const table = document.createElement('table');
            // table.id = 'closeTable';
            table = document.getElementById('closeTable');
            table.style.width = '100%';


            const headers = ['Task Name', 'Due Date', 'Created Date'];
            let headerRow = '<tr>';
            headers.forEach(header => {
              headerRow += `<th>${header}</th>`;
            });
            headerRow += '</tr>';
            table.innerHTML += headerRow;


            oldItem.forEach(task => {
              let row = '<tr>';

              Object.entries(task).forEach(([key, value]) => {
                if (key !== 'taskId') {
                  row += `<td>${value}</td>`;
                }
              });
              row += '</tr>';
              table.innerHTML += row;
            });

            return table;
          }

          const div2 = document.getElementById('close');
          div2.appendChild(createCloseTable(oldItem));

        }
      } else {
        const div = document.querySelector('div');
        const h1 = document.createElement('h1');
        h1.textContent = "Task is not found";
        div.appendChild(h1);
      }
    })

});




function toggleStatus(taskId) {

  console.log(`Task ID: ${taskId}`);

  var config = {
    Entity: "Tasks",
    APIData: {
      "id": taskId,
      "Status": "Completed"
    },
    Trigger: ["workflow"]
  }
  ZOHO.CRM.API.updateRecord(config)
    .then(function () {

      const openRow = document.querySelector(`button[data-id='${taskId}']`).closest('tr');

      openRow.remove();



      const taskData = {
        taskId: taskId,
        taskName: openRow.querySelector('td:nth-child(1)').textContent,
        dueDate: openRow.querySelector('td:nth-child(2)').textContent,
        createdDate: openRow.querySelector('td:nth-child(3)').textContent
      };


      let closedRow = `<tr>
                         <td>${taskData.taskName}</td>
                         <td>${taskData.dueDate}</td>
                         <td>${taskData.createdDate}</td>
                       </tr>`;


      const openTable = document.getElementById('openTable');
      const rows = openTable ? openTable.getElementsByTagName('tr') : [];

      if (rows.length <= 1) {
        openTable.remove();

        const errorMessage = document.createElement('h1');
        errorMessage.textContent = 'Open task is not found';
        errorMessage.style.color = 'red';
        document.body.appendChild(errorMessage);
      } 


      const closedTable = document.getElementById('closeTable');

      if (closedTable !== null) {
        closedTable.innerHTML += closedRow;
      }

      else {
        // const table = document.createElement('table');
        // table.id = 'closeTable';
        const table = document.getElementById('closedTable');
        table.style.width = '100%';


        const headers = ['Task Name', 'Due Date', 'Created Date'];

        let headerRow = '<tr>';
        headers.forEach(header => {
          headerRow += `<th>${header}</th>`;
        });
        headerRow += '</tr>';

        table.innerHTML += headerRow;
        table.innerHTML += closedRow;
      }



      console.log('Task moved to closed!');
    })
    .catch(function (error) {
      console.error('Error updating task status:', error);
    });

}

ZOHO.embeddedApp.init();