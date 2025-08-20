import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createMessage1631039612326 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'messages',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'thread',
            type: 'uuid',
          },
          {
            name: 'from',
            type: 'enum',
            enum: ['AGENT', 'CONTACT'],
          },
          {
            name: 'viewed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'content',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['image', 'audio', 'text'],
          },
          {
            name: 'media',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'messages',
      new TableForeignKey({
        columnNames: ['thread'],
        referencedTableName: 'threads',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('messages');
  }
}
