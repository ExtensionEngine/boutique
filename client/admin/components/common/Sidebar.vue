<template>
  <aside class="menu">
    <p class="menu-label">
      Actions
    </p>
    <ul class="menu-list">
      <li>
        <router-link to="/admin"> Dashboard </router-link>
      </li>
      <li>
        <router-link to="/admin/users"> Users </router-link>
      </li>
    </ul>

    <p class="menu-label">
      Administration
    </p>
    <ul class="menu-list">
      <li>
        Programs

        <ul>
          <li>
            <router-link to="/admin/programs/new"> Add new </router-link>
          </li>
          <li>
            <router-link to="/admin/programs"> Show All </router-link>
          </li>
        </ul>
      </li>
      <li>
        <router-link to="/admin/districts"> Districts </router-link>
      </li>
      <li>
        <router-link to="/admin/schools"> Schools </router-link>
      </li>
    </ul>
    <p class="menu-label">
      Reports
    </p>
    <ul class="menu-list">
      <li><a>Districts</a></li>
      <li><a>Learners</a></li>
      <li><a>Tools</a></li>
    </ul>
  </aside>
</template>
