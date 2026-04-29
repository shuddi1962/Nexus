import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../middleware/auth'
import { insforge, collections } from '../lib/insforge'
import { logger } from '../lib/logger'

interface Product {
  id: string
  org_id: string
  name: string
  description?: string
  category?: string
  price?: number
  currency?: string
  specifications?: Record<string, string>
  keywords?: string[]
  featured?: boolean
  new_arrival?: boolean
  in_stock?: boolean
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text?: string
  is_primary?: boolean
  format?: 'square' | 'landscape' | 'portrait'
  width?: number
  height?: number
  priority?: number
  created_at: string
}

interface Service {
  id: string
  org_id: string
  name: string
  description?: string
  category?: string
  price?: number
  currency?: string
  duration?: string
  deliverables?: string[]
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export async function productsRoutes(app: FastifyInstance) {
  // Create Product
  app.post('/products', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const productData = request.body as Partial<Product>

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      const product = {
        org_id: orgId,
        name: productData.name || 'Unnamed Product',
        description: productData.description || '',
        category: productData.category || '',
        price: productData.price || 0,
        currency: productData.currency || 'USD',
        specifications: productData.specifications || {},
        keywords: productData.keywords || [],
        featured: productData.featured || false,
        new_arrival: productData.new_arrival || false,
        in_stock: productData.in_stock !== false,
        status: productData.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.products}`, product)
      reply.code(201).send(result.data)
    } catch (error) {
      logger.error('Error creating product:', error)
      reply.code(500).send({ error: 'Failed to create product' })
    }
  })

  // Get Products
  app.get('/products', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { page = 1, limit = 20, category, search, featured } = request.query as {
        page?: number
        limit?: number
        category?: string
        search?: string
        featured?: boolean
      }

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      // Build query
      let queryParams: any = { org_id: `eq.${orgId}` }
      if (category) queryParams.category = `eq.${category}`
      if (featured !== undefined) queryParams.featured = `eq.${featured}`
      if (search) {
        queryParams.or = `(name.ilike.*${search}*,description.ilike.*${search}*)`
      }

      const productsResult = await insforge.get(`/collections/${collections.products}`, {
        params: queryParams
      })

      const products = productsResult.data || []

      reply.send({
        products,
        pagination: {
          page,
          limit,
          total: products.length,
          pages: Math.ceil(products.length / limit),
        },
      })
    } catch (error) {
      logger.error('Error fetching products:', error)
      reply.code(500).send({ error: 'Failed to fetch products' })
    }
  })

  // Get Single Product
  app.get('/products/:productId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { productId } = request.params as { productId: string }

      // Get product
      const productResult = await insforge.get(`/collections/${collections.products}/${productId}`)
      if (!productResult.data) {
        return reply.code(404).send({ error: 'Product not found' })
      }

      const product = productResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${product.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Get product images
      const imagesResult = await insforge.get(`/collections/${collections.productImages}`, {
        params: { product_id: `eq.${productId}` }
      })

      reply.send({
        ...product,
        images: imagesResult.data || []
      })
    } catch (error) {
      logger.error('Error fetching product:', error)
      reply.code(500).send({ error: 'Failed to fetch product' })
    }
  })

  // Update Product
  app.patch('/products/:productId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { productId } = request.params as { productId: string }
      const updateData = request.body as Partial<Product>

      // Get product and verify ownership
      const productResult = await insforge.get(`/collections/${collections.products}/${productId}`)
      if (!productResult.data) {
        return reply.code(404).send({ error: 'Product not found' })
      }

      const product = productResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${product.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Update product
      const result = await insforge.patch(`/collections/${collections.products}/${productId}`, {
        ...updateData,
        updated_at: new Date().toISOString(),
      })

      reply.send(result.data)
    } catch (error) {
      logger.error('Error updating product:', error)
      reply.code(500).send({ error: 'Failed to update product' })
    }
  })

  // Delete Product
  app.delete('/products/:productId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { productId } = request.params as { productId: string }

      // Get product and verify ownership
      const productResult = await insforge.get(`/collections/${collections.products}/${productId}`)
      if (!productResult.data) {
        return reply.code(404).send({ error: 'Product not found' })
      }

      const product = productResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${product.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Delete product images first
      await insforge.delete(`/collections/${collections.productImages}`, {
        params: { product_id: `eq.${productId}` }
      })

      // Delete product
      await insforge.delete(`/collections/${collections.products}/${productId}`)
      reply.send({ success: true })
    } catch (error) {
      logger.error('Error deleting product:', error)
      reply.code(500).send({ error: 'Failed to delete product' })
    }
  })

  // Add Product Image
  app.post('/products/:productId/images', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { productId } = request.params as { productId: string }
      const imageData = request.body as Partial<ProductImage>

      // Get product and verify ownership
      const productResult = await insforge.get(`/collections/${collections.products}/${productId}`)
      if (!productResult.data) {
        return reply.code(404).send({ error: 'Product not found' })
      }

      const product = productResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${product.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Get existing images count for priority
      const existingImages = await insforge.get(`/collections/${collections.productImages}`, {
        params: { product_id: `eq.${productId}` }
      })

      const image = {
        product_id: productId,
        url: imageData.url || '',
        alt_text: imageData.alt_text || '',
        is_primary: imageData.is_primary || (existingImages.data?.length === 0),
        format: imageData.format || 'square',
        width: imageData.width,
        height: imageData.height,
        priority: imageData.priority || (existingImages.data?.length || 0),
        created_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.productImages}`, image)
      reply.code(201).send(result.data)
    } catch (error) {
      logger.error('Error adding product image:', error)
      reply.code(500).send({ error: 'Failed to add product image' })
    }
  })

  // Delete Product Image
  app.delete('/products/:productId/images/:imageId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { productId, imageId } = request.params as { productId: string; imageId: string }

      // Get product and verify ownership
      const productResult = await insforge.get(`/collections/${collections.products}/${productId}`)
      if (!productResult.data) {
        return reply.code(404).send({ error: 'Product not found' })
      }

      const product = productResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${product.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Delete image
      await insforge.delete(`/collections/${collections.productImages}/${imageId}`)
      reply.send({ success: true })
    } catch (error) {
      logger.error('Error deleting product image:', error)
      reply.code(500).send({ error: 'Failed to delete product image' })
    }
  })

  // --- Services Management ---

  // Create Service
  app.post('/services', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const serviceData = request.body as Partial<Service>

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      const service = {
        org_id: orgId,
        name: serviceData.name || 'Unnamed Service',
        description: serviceData.description || '',
        category: serviceData.category || '',
        price: serviceData.price || 0,
        currency: serviceData.currency || 'USD',
        duration: serviceData.duration || '',
        deliverables: serviceData.deliverables || [],
        status: serviceData.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const result = await insforge.post(`/collections/${collections.services}`, service)
      reply.code(201).send(result.data)
    } catch (error) {
      logger.error('Error creating service:', error)
      reply.code(500).send({ error: 'Failed to create service' })
    }
  })

  // Get Services
  app.get('/services', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id

      // Get user's organization
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(404).send({ error: 'Organization not found' })
      }

      const orgId = orgResult.data[0].id

      const servicesResult = await insforge.get(`/collections/${collections.services}`, {
        params: { org_id: `eq.${orgId}` }
      })

      reply.send(servicesResult.data || [])
    } catch (error) {
      logger.error('Error fetching services:', error)
      reply.code(500).send({ error: 'Failed to fetch services' })
    }
  })

  // Update Service
  app.patch('/services/:serviceId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { serviceId } = request.params as { serviceId: string }
      const updateData = request.body as Partial<Service>

      // Get service and verify ownership
      const serviceResult = await insforge.get(`/collections/${collections.services}/${serviceId}`)
      if (!serviceResult.data) {
        return reply.code(404).send({ error: 'Service not found' })
      }

      const service = serviceResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${service.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Update service
      const result = await insforge.patch(`/collections/${collections.services}/${serviceId}`, {
        ...updateData,
        updated_at: new Date().toISOString(),
      })

      reply.send(result.data)
    } catch (error) {
      logger.error('Error updating service:', error)
      reply.code(500).send({ error: 'Failed to update service' })
    }
  })

  // Delete Service
  app.delete('/services/:serviceId', { preHandler: authMiddleware }, async (request, reply) => {
    try {
      const authRequest = request as any
      const userId = authRequest.user.id
      const { serviceId } = request.params as { serviceId: string }

      // Get service and verify ownership
      const serviceResult = await insforge.get(`/collections/${collections.services}/${serviceId}`)
      if (!serviceResult.data) {
        return reply.code(404).send({ error: 'Service not found' })
      }

      const service = serviceResult.data

      // Verify organization ownership
      const orgResult = await insforge.get(`/collections/${collections.organizations}`, {
        params: { id: `eq.${service.org_id}`, owner_id: `eq.${userId}` }
      })

      if (!orgResult.data || orgResult.data.length === 0) {
        return reply.code(403).send({ error: 'Access denied' })
      }

      // Delete service
      await insforge.delete(`/collections/${collections.services}/${serviceId}`)
      reply.send({ success: true })
    } catch (error) {
      logger.error('Error deleting service:', error)
      reply.code(500).send({ error: 'Failed to delete service' })
    }
  })
}