$(function () {
  const imageElement = $(".info__image");
  const profileElement = $(".info__content");
  let idCounter = 1;

  const getUser = function (user) {
    const firstName = user.firstName;
    const fullName = `${user.firstName} ${user.lastName}`;
    const age = user.age;
    const email = user.email;
    const phone = user.phone || user.phoneNumber;
    const image = user.image;

    imageElement.find("img").attr({ src: image });

    profileElement.html(
      "<h2>" +
        fullName +
        "</h2>" +
        "<p><strong>Age:</strong> " +
        age +
        "</p>" +
        "<p><strong>Email:</strong> " +
        email +
        "</p>" +
        "<p><strong>Phone:</strong> " +
        phone +
        "</p>"
    );

    $(".posts h3").text(`${firstName}'s Posts`);
    $(".todos h3").text(`${firstName}'s To Dos`);
  };

  const getUserPosts = function (res) {
    const posts = (res && res.posts) || [];
    if (!posts.length) {
      $(".posts ul").html("<li>User has no posts</li>");
      return;
    }
    const html = $.map(posts, function (p) {
      return (
        '<li data-post-id="' +
        (p.id || "") +
        '">' +
        "<h4>" +
        (p.title || "") +
        "</h4>" +
        "<p>" +
        (p.body || "") +
        "</p>" +
        "</li>"
      );
    }).join("");
    $(".posts ul").html(html);
  };

  $(".posts h3, .todos h3").on("click", function () {
    $(this).siblings("ul").slideToggle();
  });

  const getUserTodos = function (res) {
    const todos = (res && res.todos) || [];
    if (!todos.length) {
      $(".todos ul").html("<li>User has no todos</li>");
      return;
    }
    const html = $.map(todos, function (t) {
      return "<li>" + (t.todo || "") + "</li>";
    }).join("");
    $(".todos ul").html(html);
  };

  const fetchAll = function () {
    $(".posts ul").empty();
    $(".todos ul").empty();

    $.ajax({
      url: `https://dummyjson.com/users/${idCounter}`,
      type: "GET",
      success: function (res) {
        getUser(res);
      },
      error: function (err) {
        console.error(err);
      },
    });

    $.ajax({
      url: `https://dummyjson.com/users/${idCounter}/posts`,
      type: "GET",
      success: function (res) {
        getUserPosts(res);
      },
      error: function (err) {
        console.error(err);
      },
    });

    $.ajax({
      url: `https://dummyjson.com/users/${idCounter}/todos`,
      type: "GET",
      success: function (res) {
        getUserTodos(res);
      },
      error: function (err) {
        console.error(err);
      },
    });
  };

  const $buttons = $("header button");
  $buttons.eq(0).on("click", function () {
    if (idCounter > 1) {
      idCounter--;
      fetchAll();
    } else if (idCounter === 1) {
      idCounter = 30;
      fetchAll();
    }
  });
  $buttons.eq(1).on("click", function () {
    if (idCounter === 30) {
      idCounter = 1;
      fetchAll();
    } else {
      idCounter++;
      fetchAll();
    }
  });

  fetchAll();

  const openPostModal = function (post) {
    const title = post.title;
    const body = post.body;
    const views = post.views;

    const overlay = $('<div class="overlay"></div>');
    const modal = $('<div class="modal"></div>');
    const content = $(
      "<div>" +
        "<h3>" +
        title +
        "</h3>" +
        "<p style='margin: 16px 0;'>" +
        body +
        "</p>" +
        "<p style='margin: 16px 0;'><strong>Views:</strong> " +
        views +
        "</p>" +
        '<button type="button" class="js-close-modal" style="color: black; width: 100%">Close Modal</button>' +
        "</div>"
    );
    modal.append(content);
    overlay.append(modal);

    // close handlers
    overlay.on("click", function (e) {
      if ($(e.target).is(".overlay") || $(e.target).is(".js-close-modal")) {
        overlay.remove();
      }
    });

    $(document.body).append(overlay);
  };

  // display more details of the post
  $(".posts").on("click", "h4", function () {
    const list = $(this).closest("li");
    const postId = list.data("postId");
    if (!postId) return;
    $.ajax({
      url: `https://dummyjson.com/posts/${postId}`,
      type: "GET",
      success: function (post) {
        openPostModal(post);
      },
      error: function (err) {
        console.error(err);
      },
    });
  });
});
