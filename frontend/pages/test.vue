<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-blue-600 mb-8">Tailwind CSS テスト</h1>
      
      <!-- Basic Styling Test -->
      <div class="bg-white rounded-lg p-6 shadow-lg mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">基本スタイルテスト</h2>
        <p class="text-gray-600 mb-4">このテキストが表示されていて、適切にスタイルが適用されていればTailwind CSSは動作しています。</p>
        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
          ボタンテスト
        </button>
      </div>

      <!-- Responsive Test -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-red-500 text-white p-4 rounded">Red Card</div>
        <div class="bg-green-500 text-white p-4 rounded">Green Card</div>
        <div class="bg-yellow-500 text-white p-4 rounded">Yellow Card</div>
      </div>

      <!-- Gradient Test -->
      <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg mb-8">
        <h3 class="text-xl font-bold">グラデーションテスト</h3>
        <p>このボックスにグラデーションが表示されていますか？</p>
      </div>

      <!-- Flexbox Test -->
      <div class="flex items-center justify-between bg-gray-800 text-white p-6 rounded-lg">
        <span>左側のテキスト</span>
        <span class="bg-blue-500 px-3 py-1 rounded">右側のバッジ</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Test page for Tailwind CSS functionality
useHead({
  title: 'Tailwind CSS テスト - Tech Book Rank'
})
</script>