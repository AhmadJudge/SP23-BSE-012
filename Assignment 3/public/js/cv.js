const profilePic = document.getElementById('profilePic');
const introduction = document.getElementById('introduction');


profilePic.addEventListener('mouseover', function() {
    introduction.style.display = 'block';
});

profilePic.addEventListener('mouseout', function() {
    introduction.style.display = 'none';
});