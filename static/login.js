$(function() {
    
        $('#login-form-link').click(function(e) {
            $("#login-form").delay(100).fadeIn(100);
             $("#register-form").fadeOut(100);
            $('#register-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
        $('#register-form-link').click(function(e) {
            $("#register-form").delay(100).fadeIn(100);
             $("#login-form").fadeOut(100);
            $('#login-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
        $('#login-submit').click(function(e) {
            var username = $("#username_login").val(); 
            var password = $("#password_login").val(); 
            
             $.ajax({
                type: 'POST',
                url: '/login',
                data: '{"username": "' + username + '", "password": "' + password + '"}', // or JSON.stringify ({name: 'jonas'}),
                error: function (xhr, status) {
                    alert(xhr.status + '\n' + status);
                },
                success: function(data, textStatus, xhr) { 
                    window.location = '/view-logs';
                },
                    contentType: "application/json",
                    dataType: 'json'
                });
        });

        $('#register-submit').click(function(e) {

            var username = $("#username_reg").val(); 
            var password = $("#password_reg").val(); 
                        
            $.ajax({
                type: 'POST',
                url: '/register',
                data: '{"username": "' + username + '", "password": "' + password + '"}', // or JSON.stringify ({name: 'jonas'}),
                contentType: "application/json",
            })
            .done( function() { 
                    alert("Success!");
                    // window.location = '/view-logs';
            })
            .fail( function(){
                    alert("Failed!");
            });

        });        
});

