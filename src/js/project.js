if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
      initProject();
  });
} else {
  initProject();
}

function initProject() {
  let project = document.querySelector('.projects');

  if (project.length <= 0) {
    return;
  }

  const container = project.querySelector('.content-projects');
  const swapy = Swapy.createSwapy(container);
  swapy.enable(true)

  console.log(swapy, container);
}