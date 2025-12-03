/**
 * Manual verification tests for sitemap generation
 * Run with: npx tsx src/lib/seo/__tests__/sitemap.test.ts
 */

import {
  generateStaticSitemap,
  generateProductSitemap,
  generateShopSitemap,
  generateCompleteSitemap,
} from '../sitemap.service';
import { seoConfig } from '../config';

// Test Static Sitemap
console.log('=== Testing Static Sitemap Generation ===');
const staticEntries = generateStaticSitemap();
console.log(`Generated ${staticEntries.length} static sitemap entries:`);
staticEntries.forEach((entry, index) => {
  console.log(`${index + 1}. ${entry.url}`);
  console.log(`   Priority: ${entry.priority}, Change Frequency: ${entry.changeFrequency}`);
  console.log(`   Last Modified: ${entry.lastModified.toISOString()}`);
});
console.log('\n');

// Test Product Sitemap
console.log('=== Testing Product Sitemap Generation ===');
generateProductSitemap().then((productEntries) => {
  console.log(`Generated ${productEntries.length} product sitemap entries`);
  if (productEntries.length > 0) {
    console.log('Sample product entries (first 5):');
    productEntries.slice(0, 5).forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.url}`);
      console.log(`   Priority: ${entry.priority}, Change Frequency: ${entry.changeFrequency}`);
    });
  } else {
    console.log('No products found (API may require authentication or no products available)');
  }
  console.log('\n');

  // Test Shop Sitemap
  console.log('=== Testing Shop Sitemap Generation ===');
  return generateShopSitemap();
}).then((shopEntries) => {
  console.log(`Generated ${shopEntries.length} shop sitemap entries`);
  if (shopEntries.length > 0) {
    console.log('Sample shop entries (first 5):');
    shopEntries.slice(0, 5).forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.url}`);
      console.log(`   Priority: ${entry.priority}, Change Frequency: ${entry.changeFrequency}`);
    });
  } else {
    console.log('No shops found (shop listing API not implemented yet)');
  }
  console.log('\n');

  // Test Complete Sitemap
  console.log('=== Testing Complete Sitemap Generation ===');
  return generateCompleteSitemap();
}).then((allEntries) => {
  console.log(`Generated ${allEntries.length} total sitemap entries`);
  console.log('\n');

  // Verification checks
  console.log('=== Verification Checks ===');

  // Check 1: All URLs are unique
  const urls = allEntries.map((entry) => entry.url);
  const uniqueUrls = new Set(urls);
  console.log('✓ All URLs are unique:', urls.length === uniqueUrls.size, `(${urls.length} total, ${uniqueUrls.size} unique)`);

  // Check 2: All URLs are absolute
  const allAbsolute = allEntries.every((entry) => entry.url.startsWith('http://') || entry.url.startsWith('https://'));
  console.log('✓ All URLs are absolute:', allAbsolute);

  // Check 3: All priorities are valid (0-1)
  const allPrioritiesValid = allEntries.every((entry) => entry.priority >= 0 && entry.priority <= 1);
  console.log('✓ All priorities are valid (0-1):', allPrioritiesValid);

  // Check 4: Homepage has highest priority
  const homepage = allEntries.find((entry) => entry.url.endsWith('/') && !entry.url.includes('/san-pham'));
  console.log('✓ Homepage has priority 1.0:', homepage?.priority === 1.0);

  // Check 5: Change frequencies are valid
  const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
  const allFrequenciesValid = allEntries.every((entry) => validFrequencies.includes(entry.changeFrequency));
  console.log('✓ All change frequencies are valid:', allFrequenciesValid);

  // Check 6: All entries have lastModified dates
  const allHaveLastModified = allEntries.every((entry) => entry.lastModified instanceof Date);
  console.log('✓ All entries have lastModified dates:', allHaveLastModified);

  // Check 7: Priority ordering is correct
  const { priority } = seoConfig.sitemap;
  const priorityOrderCorrect = 
    priority.homepage === 1.0 &&
    priority.categories === 0.8 &&
    priority.products === 0.6 &&
    priority.shops === 0.6 &&
    priority.static === 0.4 &&
    priority.homepage > priority.categories &&
    priority.categories > priority.products &&
    priority.products >= priority.shops &&
    priority.shops > priority.static;
  console.log('✓ Priority ordering is correct:', priorityOrderCorrect);

  // Check 8: Change frequency configuration is valid
  const { changeFrequency } = seoConfig.sitemap;
  const changeFreqValid = 
    validFrequencies.includes(changeFrequency.homepage) &&
    validFrequencies.includes(changeFrequency.products) &&
    validFrequencies.includes(changeFrequency.shops) &&
    validFrequencies.includes(changeFrequency.categories) &&
    validFrequencies.includes(changeFrequency.static);
  console.log('✓ Change frequency configuration is valid:', changeFreqValid);

  // Check 9: Static pages are included
  const hasHomepage = allEntries.some((entry) => entry.url.endsWith('/') && !entry.url.includes('/san-pham'));
  const hasProductListing = allEntries.some((entry) => entry.url.includes('/san-pham') && !entry.url.match(/\/san-pham\/.+/));
  const hasSearch = allEntries.some((entry) => entry.url.includes('/tim-kiem'));
  console.log('✓ Homepage is included:', hasHomepage);
  console.log('✓ Product listing page is included:', hasProductListing);
  console.log('✓ Search page is included:', hasSearch);

  console.log('\n=== All Verification Checks Complete ===');
}).catch((error) => {
  console.error('Error during sitemap generation:', error);
});
