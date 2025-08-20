import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createThread1631039612325 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'threads',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'contact',
            type: 'uuid',
          },
          {
            name: 'agent',
            type: 'uuid',
          },
          {
            name: 'thread_id',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['OPEN', 'CLOSED'],
            default: `'OPEN'`,
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
      'threads',
      new TableForeignKey({
        columnNames: ['agent'],
        referencedTableName: 'agents',
        referencedColumnNames: ['id'],
      }),
    );
    await queryRunner.createForeignKey(
      'threads',
      new TableForeignKey({
        columnNames: ['contact'],
        referencedTableName: 'contacts',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('threads');
  }
}
