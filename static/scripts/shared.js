function navTo(event) {
    location.href = `/${event.target.id}`;
    console.log('clicked');
    event.preventDefault();
}
