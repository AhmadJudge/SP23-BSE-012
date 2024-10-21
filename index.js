

let users = [];


function fetchUsers() {
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/posts",
        method: "GET",
        dataType: "json",
        success: function (response) {
          
            users = response.slice(0, 5).map(post => ({
                name: post.title, 
                movies: [] 
            }));
            displayUsers();
        },
        error: function (error) {
            console.error("Error fetching users:", error);
        }
    });
}


function displayUsers() {
    const usersList = $("#usersList");
    usersList.empty();

    $.each(users, function (index, user) {
        usersList.append(
            `<div class="mb-3" id="user-${index}">
                <h3>${user.name}</h3>
                <div>Movies: ${user.movies.length ? user.movies.join(", ") : "None"}</div>
                <div>
                    <button class="btn btn-info btn-sm mr-2 btn-edit" data-index="${index}">Edit</button>
                    <button class="btn btn-danger btn-sm mr-2 btn-del" data-index="${index}">Delete</button>
                </div>
            </div>
            <hr />`
        );
    });
}

function deleteUser() {
    const userIndex = $(this).attr("data-index");
    $.ajax({
        url: `https://jsonplaceholder.typicode.com/posts/${userIndex + 1}`, 
        method: "DELETE",
        success: function () {
            users.splice(userIndex, 1); 
            displayUsers(); 
        },
        error: function (error) {
            console.error("Error deleting user:", error);
        }
    });
}


function handleFormSubmission(event) {
    event.preventDefault();
    const userIndex = $("#createBtn").attr("data-index");
    const name = $("#createName").val();
    const movies = $("#createMovies").val().split(",").map(movie => movie.trim());

    if (userIndex !== undefined) {
      
        $.ajax({
            url: `https://jsonplaceholder.typicode.com/posts/${parseInt(userIndex) + 1}`, 
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ title: name, body: movies.join(", ") }), 
            success: function () {
                users[userIndex] = { name: name, movies: movies }; 
                displayUsers(); 
                resetForm(); 
            },
            error: function (error) {
                console.error("Error updating user:", error);
            }
        });
    } else {
 
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts", 
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ title: name, body: movies.join(", ") }), 
            success: function (response) {
                users.push({ name: name, movies: movies }); 
                displayUsers(); 
                resetForm();
            },
            error: function (error) {
                console.error("Error creating user:", error);
            }
        });
    }
}



function editBtnClicked(event) {
    event.preventDefault();
    const userIndex = $(this).attr("data-index");
    const user = users[userIndex];

    $("#createName").val(user.name);
    $("#createMovies").val(user.movies.join(", "));
    $("#createBtn").html("Update").attr("data-index", userIndex);
    $("#clearBtn").show(); 
}


function resetForm() {
    $("#createForm")[0].reset();
    $("#createBtn").html("Create User").removeAttr("data-index");
    $("#clearBtn").hide(); 
}


$(document).ready(function () {
 
    fetchUsers();

    $(document).on("click", ".btn-del", deleteUser);
    $(document).on("click", ".btn-edit", editBtnClicked);
    $("#createForm").submit(handleFormSubmission);
    

    $("#clearBtn").on("click", function (e) {
        e.preventDefault();
        resetForm(); 
    });
});
