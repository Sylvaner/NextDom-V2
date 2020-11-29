import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Light} from '../models';
import {LightRepository} from '../repositories';

export class LightControllerController {
  constructor(
    @repository(LightRepository)
    public lightRepository : LightRepository,
  ) {}

  @post('/lights', {
    responses: {
      '200': {
        description: 'Light model instance',
        content: {'application/json': {schema: getModelSchemaRef(Light)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Light, {
            title: 'NewLight',
            
          }),
        },
      },
    })
    light: Light,
  ): Promise<Light> {
    return this.lightRepository.create(light);
  }

  @get('/lights/count', {
    responses: {
      '200': {
        description: 'Light model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Light) where?: Where<Light>,
  ): Promise<Count> {
    return this.lightRepository.count(where);
  }

  @get('/lights', {
    responses: {
      '200': {
        description: 'Array of Light model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Light, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Light) filter?: Filter<Light>,
  ): Promise<Light[]> {
    return this.lightRepository.find(filter);
  }

  @patch('/lights', {
    responses: {
      '200': {
        description: 'Light PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Light, {partial: true}),
        },
      },
    })
    light: Light,
    @param.where(Light) where?: Where<Light>,
  ): Promise<Count> {
    return this.lightRepository.updateAll(light, where);
  }

  @get('/lights/{id}', {
    responses: {
      '200': {
        description: 'Light model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Light, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Light, {exclude: 'where'}) filter?: FilterExcludingWhere<Light>
  ): Promise<Light> {
    return this.lightRepository.findById(id, filter);
  }

  @patch('/lights/{id}', {
    responses: {
      '204': {
        description: 'Light PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Light, {partial: true}),
        },
      },
    })
    light: Light,
  ): Promise<void> {
    await this.lightRepository.updateById(id, light);
  }

  @put('/lights/{id}', {
    responses: {
      '204': {
        description: 'Light PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() light: Light,
  ): Promise<void> {
    await this.lightRepository.replaceById(id, light);
  }

  @del('/lights/{id}', {
    responses: {
      '204': {
        description: 'Light DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.lightRepository.deleteById(id);
  }
}
