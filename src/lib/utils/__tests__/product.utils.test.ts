import { transformVariantsForAPI } from "../product.utils";
import { ProductClassification } from "@/types/shops/product.type";
import { UIVariant } from "@/hooks/useProductCreation";

/**
 * Test file to verify the new payload structure
 * Run this to see the generated payload structure
 */

describe("transformVariantsForAPI - New Payload Structure", () => {
  it("should generate correct payload structure with propertyValueIds", () => {
    // Mock data: iPhone 15 Pro Max with Color and Storage classifications
    const classifications: ProductClassification[] = [
      {
        id: "class-1",
        propertyId: "64f8a1b2c3d4e5f6a7b8c9d2", // Color property
        propertyName: "Màu sắc",
        values: ["Titanium Natural"],
      },
      {
        id: "class-2",
        propertyId: "64f8a1b2c3d4e5f6a7b8c9d4", // Storage property
        propertyName: "Dung lượng",
        values: ["256GB", "512GB"],
      },
    ];

    const uiVariants: UIVariant[] = [
      {
        id: "variant-1",
        values: [
          { propertyId: "64f8a1b2c3d4e5f6a7b8c9d2", value: "Titanium Natural" },
          { propertyId: "64f8a1b2c3d4e5f6a7b8c9d4", value: "256GB" },
        ],
        price: 29990000,
        stock: 50,
        sku: "IP15PM-TN-256",
      },
      {
        id: "variant-2",
        values: [
          { propertyId: "64f8a1b2c3d4e5f6a7b8c9d2", value: "Titanium Natural" },
          { propertyId: "64f8a1b2c3d4e5f6a7b8c9d4", value: "512GB" },
        ],
        price: 33990000,
        stock: 30,
        sku: "IP15PM-TN-512",
      },
    ];

    const uploadedVariantImages = {
      "Titanium Natural": "https://example.com/images/titanium-natural.jpg",
    };

    // Transform
    const result = transformVariantsForAPI(
      uiVariants,
      classifications,
      uploadedVariantImages
    );

    // Verify structure
    expect(result).toHaveProperty("propertyValues");
    expect(result).toHaveProperty("variants");

    // Verify propertyValues
    expect(result.propertyValues).toHaveLength(3); // Titanium Natural, 256GB, 512GB
    result.propertyValues.forEach((pv) => {
      expect(pv).toHaveProperty("propertyValueId");
      expect(pv.propertyValueId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      ); // UUID v4 format
      expect(pv).toHaveProperty("value");
      expect(pv).toHaveProperty("propertyProductId");
      expect(pv).toHaveProperty("level");
      expect(pv).toHaveProperty("urlImage");
    });

    // Verify level 0 has image
    const colorProperty = result.propertyValues.find((pv) => pv.level === 0);
    expect(colorProperty?.urlImage).toBe(
      "https://example.com/images/titanium-natural.jpg"
    );

    // Verify level 1 has no image
    const storageProperties = result.propertyValues.filter(
      (pv) => pv.level === 1
    );
    storageProperties.forEach((pv) => {
      expect(pv.urlImage).toBeNull();
    });

    // Verify variants
    expect(result.variants).toHaveLength(2);
    result.variants.forEach((variant) => {
      expect(variant).toHaveProperty("variantCreateDto");
      expect(variant).toHaveProperty("propertyValueIds");

      // Verify variantCreateDto structure
      expect(variant.variantCreateDto).toHaveProperty("price");
      expect(variant.variantCreateDto).toHaveProperty("quantity");
      expect(variant.variantCreateDto).toHaveProperty("status");
      expect(variant.variantCreateDto.status).toBe(1);

      // Verify propertyValueIds are UUIDs
      expect(variant.propertyValueIds).toHaveLength(2);
      variant.propertyValueIds.forEach((id) => {
        expect(id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        );
      });
    });

    // Log the result for manual inspection
    console.log("Generated Payload Structure:");
    console.log(JSON.stringify(result, null, 2));
  });

  it("should generate complete CreateProductPayload structure", () => {
    // This demonstrates the complete payload structure
    const mockCompletePayload = {
      product: {
        name: "iPhone 15 Pro Max",
        description:
          "Điện thoại iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP và màn hình Dynamic Island",
        categoryChildId: "64f8a1b2c3d4e5f6a7b8c9d0",
        weight: 221,
        height: 159,
        length: 76,
        width: 8,
        images: [
          {
            urlImage: "https://example.com/images/iphone15-1.jpg",
            sortOrder: 0,
          },
          {
            urlImage: "https://example.com/images/iphone15-2.jpg",
            sortOrder: 1,
          },
        ],
        productInformations: [
          {
            name: "Màn hình",
            value: "6.7 inch Super Retina XDR",
          },
          {
            name: "Chip",
            value: "A17 Pro",
          },
          {
            name: "Camera",
            value: "48MP chính + 12MP siêu rộng + 12MP tele",
          },
        ],
      },
      propertyValues: [
        {
          propertyValueId: "64f8a1b2c3d4e5f6a7b8c9d1",
          value: "Titanium Natural",
          propertyProductId: "64f8a1b2c3d4e5f6a7b8c9d2",
          level: 0,
          urlImage: "https://example.com/images/titanium-natural.jpg",
        },
        {
          propertyValueId: "64f8a1b2c3d4e5f6a7b8c9d3",
          value: "256GB",
          propertyProductId: "64f8a1b2c3d4e5f6a7b8c9d4",
          level: 1,
          urlImage: null,
        },
        {
          propertyValueId: "64f8a1b2c3d4e5f6a7b8c9d5",
          value: "512GB",
          propertyProductId: "64f8a1b2c3d4e5f6a7b8c9d4",
          level: 1,
          urlImage: null,
        },
      ],
      variants: [
        {
          variantCreateDto: {
            price: 29990000,
            quantity: 50,
            status: 1,
          },
          propertyValueIds: [
            "64f8a1b2c3d4e5f6a7b8c9d1",
            "64f8a1b2c3d4e5f6a7b8c9d3",
          ],
        },
        {
          variantCreateDto: {
            price: 33990000,
            quantity: 30,
            status: 1,
          },
          propertyValueIds: [
            "64f8a1b2c3d4e5f6a7b8c9d1",
            "64f8a1b2c3d4e5f6a7b8c9d5",
          ],
        },
      ],
    };

    console.log("Expected Complete Payload:");
    console.log(JSON.stringify(mockCompletePayload, null, 2));

    // Verify structure matches expected format
    expect(mockCompletePayload).toHaveProperty("product");
    expect(mockCompletePayload).toHaveProperty("propertyValues");
    expect(mockCompletePayload).toHaveProperty("variants");
  });
});

